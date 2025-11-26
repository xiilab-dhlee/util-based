import { format, isValid, parseISO } from "date-fns";

/**
 * 안전하게 날짜/시간 값을 포맷팅하는 유틸 함수입니다.
 * - 지원 타입: string(ISO), Date, null/undefined
 * - 유효하지 않은 값이거나 파싱 실패 시 null을 반환합니다.
 */
export const formatDateTimeSafely = (value?: string | Date | null) => {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? parseISO(value) : value;

  if (!isValid(date)) {
    return null;
  }

  return format(date, "yyyy-MM-dd HH:mm:ss");
};
