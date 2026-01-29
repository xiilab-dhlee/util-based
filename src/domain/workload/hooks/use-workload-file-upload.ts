"use client";

// axios는 AxiosService를 통해 사용
import { useEffect, useRef, useState } from "react";

import { AxiosService } from "@/shared/api/axios";
import type { UploadFileStatus } from "@/shared/types/upload.type";

interface UploadFileInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  status: UploadFileStatus;
  progress: number;
  error?: string;
}

interface WorkloadUploadOptions {
  workspaceId: number;
  workloadResourceName: string;
  uploadPath: string;
  podName?: string;
}

interface UseWorkloadFileUploadReturn {
  files: UploadFileInfo[];
  isUploading: boolean;
  addFiles: (fileList: FileList) => void;
  removeFile: (fileId: string) => void;
  startUpload: () => Promise<void>;
  cancelAllUploads: () => void;
  clearFiles: () => void;
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * 워크로드 파일 업로드 훅
 *
 * Orval에서 생성된 API를 기반으로 multipart/form-data 방식으로 파일을 업로드합니다.
 */
export function useWorkloadFileUpload(
  options: WorkloadUploadOptions,
): UseWorkloadFileUploadReturn {
  const { workspaceId, workloadResourceName, uploadPath, podName } = options;

  const [files, setFiles] = useState<UploadFileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const filesRef = useRef<UploadFileInfo[]>([]);
  const isMountedRef = useRef(true);

  // filesRef를 최신 상태로 유지
  filesRef.current = files;

  // 언마운트 시 상태 업데이트 방지를 위한 안전한 setState
  const safeSetFiles = (
    updater: UploadFileInfo[] | ((prev: UploadFileInfo[]) => UploadFileInfo[]),
  ) => {
    if (isMountedRef.current) {
      setFiles(updater);
    }
  };

  const safeSetIsUploading = (value: boolean) => {
    if (isMountedRef.current) {
      setIsUploading(value);
    }
  };

  const updateFile = (fileId: string, updates: Partial<UploadFileInfo>) => {
    safeSetFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f)),
    );
  };

  const addFiles = (fileList: FileList) => {
    const newFiles: UploadFileInfo[] = Array.from(fileList).map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const clearFiles = () => {
    setFiles([]);
    abortControllersRef.current.clear();
  };

  // 컴포넌트 마운트 상태 추적 및 언마운트 시 진행 중인 업로드 취소
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      for (const controller of abortControllersRef.current.values()) {
        controller.abort();
      }
      abortControllersRef.current.clear();
    };
  }, []);

  const uploadSingleFile = async (fileInfo: UploadFileInfo): Promise<void> => {
    const abortController = new AbortController();
    abortControllersRef.current.set(fileInfo.id, abortController);

    try {
      updateFile(fileInfo.id, { status: "uploading" });

      const axiosInstance = AxiosService.getInstance().getAxios();
      const formData = new FormData();
      formData.append("file", fileInfo.file);

      const endpoint = `/api/v1/workspaces/${workspaceId}/workloads/${workloadResourceName}/files/upload`;

      await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: {
          path: uploadPath,
          ...(podName ? { podName } : {}),
        },
        signal: abortController.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            updateFile(fileInfo.id, { progress });
          }
        },
      });

      updateFile(fileInfo.id, { status: "completed", progress: 100 });
    } catch (error) {
      const isCancelled =
        (error as Error).name === "AbortError" ||
        (error as Error).name === "CanceledError";

      if (isCancelled) {
        updateFile(fileInfo.id, { status: "cancelled" });
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "업로드 실패";
        updateFile(fileInfo.id, { status: "error", error: errorMessage });
      }
    } finally {
      abortControllersRef.current.delete(fileInfo.id);
    }
  };

  const startUpload = async () => {
    const uploadableFiles = filesRef.current.filter(
      (f) => f.status === "pending" || f.status === "error",
    );
    if (uploadableFiles.length === 0) return;

    safeSetIsUploading(true);

    try {
      for (const fileInfo of uploadableFiles) {
        if (fileInfo.status === "error") {
          updateFile(fileInfo.id, {
            status: "pending",
            progress: 0,
            error: undefined,
          });
        }
        await uploadSingleFile(fileInfo);
      }
    } finally {
      safeSetIsUploading(false);
    }
  };

  const cancelAllUploads = () => {
    // 모든 진행 중인 요청 중단
    for (const controller of abortControllersRef.current.values()) {
      controller.abort();
    }
    abortControllersRef.current.clear();

    // 업로드 중인 파일들의 상태를 취소로 변경
    safeSetFiles((prev) =>
      prev.map((f) =>
        f.status === "uploading" ? { ...f, status: "cancelled" } : f,
      ),
    );
    safeSetIsUploading(false);
  };

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    startUpload,
    cancelAllUploads,
    clearFiles,
  };
}
