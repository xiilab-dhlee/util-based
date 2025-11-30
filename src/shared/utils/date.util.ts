import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isValid,
  parseISO,
} from "date-fns";

/**
 * 주어진 날짜 문자열로부터 현재 시간까지의 경과 시간을 한국어로 반환
 * date-fns 라이브러리를 활용하여 구현
 * @param dateStr - ISO 8601 형식의 날짜 문자열
 * @returns 경과 시간을 나타내는 한국어 문자열
 */
export function formatElapsedTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return "잘못된 날짜";
    }

    const now = new Date();
    const diffSec = differenceInSeconds(now, date);
    const diffMin = differenceInMinutes(now, date);
    const diffHour = differenceInHours(now, date);
    const diffDay = differenceInDays(now, date);

    if (diffSec < 60) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;

    const remainHours = diffHour % 24;
    const remainMins = diffMin % 60;

    if (remainHours > 0 && remainMins > 0) {
      return `${diffDay}일 ${remainHours}시간 ${remainMins}분 전`;
    }
    if (remainHours > 0) {
      return `${diffDay}일 ${remainHours}시간 전`;
    }
    if (remainMins > 0) {
      return `${diffDay}일 ${remainMins}분 전`;
    }
    return `${diffDay}일 전`;
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    return "잘못된 날짜";
  }
}

/**
 * 안전하게 날짜/시간 값을 포맷팅하는 유틸 함수입니다.
 * - 지원 타입: string(ISO), Date, null/undefined
 * - 유효하지 않은 값이거나 파싱 실패 시 null을 반환합니다.
 */
export const formatDateTimeSafely = (
  value?: string | Date | null,
): string | null => {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? parseISO(value) : value;

  if (!isValid(date)) {
    return null;
  }

  return format(date, "yyyy-MM-dd HH:mm:ss");
};

/**
 * 안전하게 날짜 값을 포맷팅하는 유틸 함수입니다.
 * - 지원 타입: string(ISO), Date, null/undefined
 * - 유효하지 않은 값이거나 파싱 실패 시 fallback 값을 반환합니다.
 * @param value - 포맷팅할 날짜 값
 * @param formatStr - 날짜 포맷 문자열 (기본값: "yyyy.MM.dd")
 * @param fallback - 유효하지 않은 값일 때 반환할 문자열 (기본값: "-")
 */
export const formatDateSafely = (
  value?: string | Date | null,
  formatStr: string = "yyyy.MM.dd",
  fallback: string = "-",
): string => {
  if (!value) {
    return fallback;
  }

  try {
    const date = typeof value === "string" ? parseISO(value) : value;

    if (!isValid(date)) {
      return fallback;
    }

    return format(date, formatStr);
  } catch {
    return fallback;
  }
};
