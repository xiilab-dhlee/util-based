// ============================================
// 파일 크기 관련
// ============================================

/**
 * 파일 크기 단위 타입
 */
type FileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";

/**
 * 파일 크기 정보 인터페이스
 */
interface FileSizeInfo {
  /** 변환된 크기 값 */
  value: number;
  /** 단위 */
  unit: FileSizeUnit;
  /** 포맷된 문자열 */
  formatted: string;
}

/**
 * 바이트를 적절한 단위로 변환하는 함수
 *
 * @param bytes - 바이트 단위의 파일 크기
 * @param precision - 소수점 자릿수 (기본값: 2)
 * @returns 파일 크기 정보 객체
 *
 * @example
 * ```typescript
 * const sizeInfo = formatFileSize(1024); // { value: 1, unit: "KB", formatted: "1.00 KB" }
 * const sizeInfo = formatFileSize(1536); // { value: 1.5, unit: "KB", formatted: "1.50 KB" }
 * const sizeInfo = formatFileSize(1073741824); // { value: 1, unit: "GB", formatted: "1.00 GB" }
 * ```
 */
export function formatFileSize(
  bytes: number,
  precision: number = 2,
): FileSizeInfo {
  if (bytes === 0) {
    return {
      value: 0,
      unit: "B",
      formatted: "0 B",
    };
  }

  const k = 1024;
  const sizes: FileSizeUnit[] = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // 최대 TB 단위까지만 지원
  const unitIndex = Math.min(i, sizes.length - 1);
  const unit = sizes[unitIndex];
  const value = bytes / k ** unitIndex;

  return {
    value,
    unit,
    formatted: `${value.toFixed(precision)} ${unit}`,
  };
}

// ============================================
// 파일 확장자 관련
// ============================================

/** 미리보기 가능한 이미지 확장자 */
export const PREVIEWABLE_IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "bmp",
] as const;

/** 미리보기 가능한 텍스트 확장자 */
export const PREVIEWABLE_TEXT_EXTENSIONS = [
  "txt",
  "log",
  "md",
  "json",
  "yaml",
  "yml",
  "xml",
  "csv",
  "sh",
  "bash",
  "py",
  "js",
  "ts",
  "java",
  "kt",
  "kts",
  "go",
] as const;

/**
 * 파일 확장자를 정규화하는 함수
 * @param extension - 파일 확장자
 * @returns 정규화된 확장자 (소문자)
 */
export const normalizeExtension = (
  extension: string | null | undefined,
): string | null => {
  if (!extension) return null;
  const normalized = extension.trim().replace(/^\.+/, "");
  const segments = normalized.split(".");
  return segments[segments.length - 1].toLowerCase();
};

/**
 * 파일이 미리보기 가능한 이미지인지 확인하는 함수
 * @param extension - 파일 확장자
 * @returns 이미지 미리보기 가능 여부
 */
export const isPreviewableImage = (
  extension: string | null | undefined,
): boolean => {
  const ext = normalizeExtension(extension);
  if (!ext) return false;
  return PREVIEWABLE_IMAGE_EXTENSIONS.some((e) => e === ext);
};

/**
 * 파일이 미리보기 가능한 텍스트인지 확인하는 함수
 * @param extension - 파일 확장자
 * @returns 텍스트 미리보기 가능 여부
 */
export const isPreviewableText = (
  extension: string | null | undefined,
): boolean => {
  const ext = normalizeExtension(extension);
  if (!ext) return false;
  return PREVIEWABLE_TEXT_EXTENSIONS.some((e) => e === ext);
};

/**
 * 파일의 미리보기 타입을 반환하는 함수
 * @param extension - 파일 확장자
 * @returns "image" | "text" | null
 */
export const getPreviewType = (
  extension: string | null | undefined,
): "image" | "text" | null => {
  if (isPreviewableImage(extension)) return "image";
  if (isPreviewableText(extension)) return "text";
  return null;
};

// ============================================
// 파일 아이콘 관련
// ============================================

/**
 * 파일 확장자에 따른 아이콘 이름을 반환하는 함수
 * xiilab-ui에서 지원하는 아이콘만 사용
 *
 * @param extension - 파일 확장자 (null인 경우 기본 아이콘 반환)
 * @param type - 파일 타입 (file | directory)
 * @returns 아이콘 이름
 */
export const getFileIconName = (
  extension: string | null | undefined,
  type: "file" | "directory",
): string => {
  if (type === "directory") {
    return "FolderFiled";
  }

  const ext = normalizeExtension(extension);
  if (!ext) {
    return "File";
  }

  // 압축 파일
  if (["zip", "tar", "gz", "rar", "7z", "tgz"].includes(ext)) {
    return "FileZip";
  }

  // PDF 파일
  if (ext === "pdf") {
    return "FilePdf";
  }

  // 문서 파일 (Word)
  if (["doc", "docx"].includes(ext)) {
    return "FileDoc";
  }

  // JPG 이미지
  if (["jpg", "jpeg"].includes(ext)) {
    return "FileJpg";
  }

  // PNG 이미지
  if (ext === "png") {
    return "FilePng";
  }

  // CSV 파일
  if (ext === "csv") {
    return "FileCsv";
  }

  // 텍스트 파일
  if (ext === "txt") {
    return "FileTxt";
  }

  // 기본 파일 아이콘
  return "File";
};
