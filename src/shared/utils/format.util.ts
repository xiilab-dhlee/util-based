import { isNil } from "es-toolkit";

/**
 * 숫자에 천 단위 콤마를 추가하여 문자열로 반환
 *
 * @param value 포맷할 숫자
 * @param fallback 값이 없을 때 반환할 문자열 (기본값: "-")
 * @returns 콤마가 추가된 문자열
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(0) // "0"
 * formatNumber(null) // "-"
 * formatNumber(undefined, "N/A") // "N/A"
 */
export const formatNumber = (
  value: number | null | undefined,
  fallback = "-",
): string => {
  if (isNil(value)) {
    return fallback;
  }

  return value.toLocaleString("ko-KR");
};
