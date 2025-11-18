import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import type { UploadedFile } from "xiilab-ui";

import { formatFileSize as formatFileSizeUtil } from "@/utils/common/file.util";

/**
 * 파일 업로드 관련 설정 인터페이스
 */
interface UseUploadFileOptions {
  /** 최대 파일 크기 (bytes) */
  maxFileSize?: number;
  /** 최대 파일 개수 */
  maxFileCount?: number;
  /** 허용된 파일 확장자 배열 */
  allowedExtensions?: string[];
  /** 초기 파일 목록 */
  initialFiles?: UploadedFile[];
  /** 파일 크기 초과 시 에러 메시지 */
  fileSizeErrorMessage?: string;
  /** 파일 개수 초과 시 에러 메시지 */
  fileCountErrorMessage?: string;
  /** 지원하지 않는 파일 형식 시 에러 메시지 */
  fileTypeErrorMessage?: string;
}

/**
 * 파일 업로드 Hook 반환 타입
 */
interface UseUploadFileReturn {
  /** 업로드된 파일 목록 */
  files: UploadedFile[];
  /** 파일 업로드 핸들러 */
  handleUpload: (fileList: FileList) => void;
  /** 파일 제거 핸들러 */
  handleFileRemove: (fileId: string) => void;
  /** 모든 파일 제거 */
  clearFiles: () => void;
  /** 파일 목록 설정 */
  setFiles: (files: UploadedFile[]) => void;
  /** 총 파일 크기 (bytes) */
  totalSize: number;
  /** 파일 개수 */
  fileCount: number;
}

/**
 * 파일 업로드 관련 로직을 관리하는 Hook
 *
 * @param options - 파일 업로드 설정 옵션
 * @returns 파일 업로드 관련 상태와 핸들러들
 *
 * @example
 * ```tsx
 * const {
 *   files,
 *   handleUpload,
 *   handleFileRemove,
 *   totalSize,
 *   fileCount
 * } = useUploadFile({
 *   maxFileSize: 5 * 1024 * 1024, // 5MB
 *   maxFileCount: 10,
 *   allowedExtensions: ['.pdf', '.doc', '.docx']
 * });
 * ```
 */
export const useUploadFile = (
  options: UseUploadFileOptions = {},
): UseUploadFileReturn => {
  const {
    maxFileSize = 5 * 1024 * 1024, // 기본값: 5MB
    maxFileCount,
    allowedExtensions = [],
    initialFiles = [],
    fileSizeErrorMessage = "파일이 너무 큽니다. 최대 {maxSize}까지 가능합니다.",
    fileCountErrorMessage = "최대 {maxCount}개까지 업로드 가능합니다.",
    fileTypeErrorMessage = "지원하지 않는 파일 형식입니다.",
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

  /**
   * 파일 크기를 사람이 읽기 쉬운 형태로 변환
   */
  const formatFileSize = useCallback((bytes: number): string => {
    return formatFileSizeUtil(bytes).formatted;
  }, []);

  /**
   * 파일 확장자 검증
   */
  const validateFileExtension = useCallback(
    (fileName: string): boolean => {
      if (allowedExtensions.length === 0) return true;

      const extension = fileName
        .toLowerCase()
        .substring(fileName.lastIndexOf("."));
      return allowedExtensions.some(
        (ext) =>
          ext.toLowerCase() === extension ||
          ext.toLowerCase() === extension.substring(1),
      );
    },
    [allowedExtensions],
  );

  /**
   * 파일 업로드 핸들러
   */
  const handleUpload = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadedFile[] = [];
      const fileArray = Array.from(fileList);

      // 파일 개수 제한 검증
      if (maxFileCount && files.length + fileArray.length > maxFileCount) {
        toast.error(
          fileCountErrorMessage.replace("{maxCount}", maxFileCount.toString()),
        );
        return;
      }

      fileArray.forEach((file, index) => {
        // 파일 크기 검증
        if (file.size > maxFileSize) {
          const maxSizeFormatted = formatFileSize(maxFileSize);
          toast.error(
            fileSizeErrorMessage
              .replace("{fileName}", file.name)
              .replace("{maxSize}", maxSizeFormatted),
          );
          return;
        }

        // 파일 확장자 검증
        if (!validateFileExtension(file.name)) {
          toast.error(fileTypeErrorMessage.replace("{fileName}", file.name));
          return;
        }

        // 중복 파일 검증
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size,
        );

        if (isDuplicate) {
          toast.error(`${file.name} 파일이 이미 존재합니다.`);
          return;
        }

        newFiles.push({
          id: `${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          file,
        });
      });

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [
      files,
      maxFileSize,
      maxFileCount,
      fileSizeErrorMessage,
      fileCountErrorMessage,
      fileTypeErrorMessage,
      formatFileSize,
      validateFileExtension,
    ],
  );

  /**
   * 파일 제거 핸들러
   */
  const handleFileRemove = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  /**
   * 모든 파일 제거
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  /**
   * 총 파일 크기 계산
   */
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  /**
   * 파일 개수
   */
  const fileCount = files.length;

  return {
    files,
    handleUpload,
    handleFileRemove,
    clearFiles,
    setFiles,
    totalSize,
    fileCount,
  };
};
