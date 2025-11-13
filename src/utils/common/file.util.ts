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
