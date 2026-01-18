"use client";

import { useEffect, useRef, useState } from "react";

import { AxiosService } from "@/shared/api/axios";

export type UploadFileStatus =
  | "pending"
  | "uploading"
  | "completed"
  | "error"
  | "cancelled";

export interface UploadFileInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  status: UploadFileStatus;
  progress: number;
  uploadId?: string;
  error?: string;
}

interface TusUploadOptions {
  volumeId: number;
  uploadPath: string;
  chunkSize?: number;
}

interface UseVolumeTusUploadReturn {
  files: UploadFileInfo[];
  isUploading: boolean;
  addFiles: (fileList: FileList) => void;
  removeFile: (fileId: string) => void;
  startUpload: () => Promise<void>;
  startSingleUpload: (fileId: string) => Promise<void>;
  cancelUpload: (fileId: string) => Promise<void>;
  cancelAllUploads: () => Promise<void>;
  clearFiles: () => void;
}

const TUS_VERSION = "1.0.0";
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const encodeBase64 = (str: string): string =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function useVolumeTusUpload(
  options: TusUploadOptions,
): UseVolumeTusUploadReturn {
  const { volumeId, uploadPath, chunkSize = DEFAULT_CHUNK_SIZE } = options;

  const [files, setFiles] = useState<UploadFileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const updateFile = (fileId: string, updates: Partial<UploadFileInfo>) => {
    setFiles((prev) =>
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

  // 컴포넌트 언마운트 시 진행 중인 업로드 취소
  useEffect(() => {
    return () => {
      for (const controller of abortControllersRef.current.values()) {
        controller.abort();
      }
      abortControllersRef.current.clear();
    };
  }, []);

  const createTusUpload = async (
    fileInfo: UploadFileInfo,
    signal: AbortSignal,
  ): Promise<string> => {
    const axiosInstance = AxiosService.getInstance().getAxios();
    const filename = encodeBase64(fileInfo.name);
    const filetype = btoa(fileInfo.file.type || "application/octet-stream");

    const response = await axiosInstance.post(
      `/api/v1/volumes/${volumeId}/files/upload`,
      {},
      {
        headers: {
          "Tus-Resumable": TUS_VERSION,
          "Upload-Length": fileInfo.size.toString(),
          "Upload-Metadata": `filename ${filename},filetype ${filetype}`,
          "X-Upload-Path": uploadPath,
        },
        signal,
      },
    );

    const location = response.headers.location;
    if (!location || typeof location !== "string") {
      throw new Error("업로드 위치를 찾을 수 없습니다.");
    }
    const uploadId = location.split("/").pop();
    if (!uploadId) {
      throw new Error("업로드 ID를 파싱할 수 없습니다.");
    }
    return uploadId;
  };

  const uploadChunk = async (
    fileInfo: UploadFileInfo,
    uploadId: string,
    offset: number,
    signal: AbortSignal,
  ): Promise<number> => {
    const axiosInstance = AxiosService.getInstance().getAxios();
    const end = Math.min(offset + chunkSize, fileInfo.size);
    const chunk = fileInfo.file.slice(offset, end);

    const response = await axiosInstance.patch(
      `/api/v1/volumes/${volumeId}/files/upload/${uploadId}`,
      chunk,
      {
        headers: {
          "Tus-Resumable": TUS_VERSION,
          "Upload-Offset": offset.toString(),
          "Content-Type": "application/offset+octet-stream",
        },
        signal,
      },
    );

    const uploadOffset = response.headers["upload-offset"];
    const parsedOffset = parseInt(uploadOffset as string, 10);
    if (Number.isNaN(parsedOffset)) {
      throw new Error("업로드 오프셋을 파싱할 수 없습니다.");
    }
    return parsedOffset;
  };

  const uploadSingleFile = async (fileInfo: UploadFileInfo): Promise<void> => {
    const abortController = new AbortController();
    abortControllersRef.current.set(fileInfo.id, abortController);

    try {
      updateFile(fileInfo.id, { status: "uploading" });

      const uploadId = await createTusUpload(fileInfo, abortController.signal);
      updateFile(fileInfo.id, { uploadId });

      let offset = 0;
      while (offset < fileInfo.size) {
        if (abortController.signal.aborted) {
          throw new Error("Upload cancelled");
        }

        offset = await uploadChunk(
          fileInfo,
          uploadId,
          offset,
          abortController.signal,
        );

        const progress = Math.round((offset / fileInfo.size) * 100);
        updateFile(fileInfo.id, { progress });
      }

      updateFile(fileInfo.id, { status: "completed", progress: 100 });
    } catch (error) {
      const isCancelled =
        (error as Error).name === "AbortError" ||
        (error as Error).message === "Upload cancelled";

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
    const uploadableFiles = files.filter(
      (f) => f.status === "pending" || f.status === "error",
    );
    if (uploadableFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const fileInfo of uploadableFiles) {
        if (fileInfo.status === "error") {
          updateFile(fileInfo.id, {
            status: "pending",
            progress: 0,
            error: undefined,
            uploadId: undefined,
          });
        }
        await uploadSingleFile(fileInfo);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const startSingleUpload = async (fileId: string) => {
    const fileInfo = files.find((f) => f.id === fileId);
    if (!fileInfo) return;

    if (fileInfo.status !== "pending" && fileInfo.status !== "error") return;

    setIsUploading(true);

    try {
      if (fileInfo.status === "error") {
        updateFile(fileInfo.id, {
          status: "pending",
          progress: 0,
          error: undefined,
          uploadId: undefined,
        });
      }
      await uploadSingleFile(fileInfo);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = async (fileId: string) => {
    const controller = abortControllersRef.current.get(fileId);
    controller?.abort();

    const fileInfo = files.find((f) => f.id === fileId);
    if (fileInfo?.uploadId) {
      try {
        const axiosInstance = AxiosService.getInstance().getAxios();
        await axiosInstance.delete(
          `/api/v1/volumes/${volumeId}/files/upload/${fileInfo.uploadId}`,
          { headers: { "Tus-Resumable": TUS_VERSION } },
        );
      } catch {
        // ignore
      }
    }

    updateFile(fileId, { status: "cancelled" });
  };

  const cancelAllUploads = async () => {
    const uploadingFiles = files.filter((f) => f.status === "uploading");
    await Promise.all(uploadingFiles.map((f) => cancelUpload(f.id)));
  };

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    startUpload,
    startSingleUpload,
    cancelUpload,
    cancelAllUploads,
    clearFiles,
  };
}
