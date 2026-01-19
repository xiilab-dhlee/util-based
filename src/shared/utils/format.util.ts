import { isNil } from "es-toolkit";

/**
 * 숫자에 천 단위 콤마를 추가하여 문자열로 반환
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

/**
 * 숫자를 포맷하고 단위를 붙여서 반환
 */
export const formatNumberWithUnit = (
  value: number | null | undefined,
  unit: string,
  fallback = "-",
): string => {
  if (isNil(value)) {
    return fallback;
  }

  return `${formatNumber(value)}${unit}`;
};
