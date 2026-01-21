import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isValid,
  parse,
  parseISO,
} from "date-fns";
import { isString } from "es-toolkit/predicate";

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
      return "-";
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
    return "-";
  }
}

/**
 * 안전하게 날짜/시간 값을 포맷팅하는 유틸 함수입니다.
 * - 지원 타입: string(ISO), Date, null/undefined
 * - 유효하지 않은 값이거나 파싱 실패 시 fallback 값을 반환합니다.
 * @param value - 포맷팅할 날짜 값
 * @param fallback - 유효하지 않은 값일 때 반환할 문자열 (기본값: "-")
 */
export const formatDateTimeSafely = (
  value?: string | Date | null,
  fallback: string = "-",
): string => {
  if (!value) {
    return fallback;
  }

  const date = isString(value) ? parseISO(value) : value;

  if (!isValid(date)) {
    return fallback;
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

  const date = isString(value) ? parseISO(value) : value;

  if (!isValid(date)) {
    return fallback;
  }

  return format(date, formatStr);
};

/**
 * 초 단위 duration 값을 사람이 읽기 좋은 한국어 문자열로 포맷팅합니다.
 *
 * - 0초 이하 또는 유효하지 않은 값: "0초"
 * - 1시간 미만: "M분 S초" 또는 "S초"
 * - 1시간 이상:
 *   - 60분(=3600초) 정확히: "1시간"
 *   - 61분(=3660초): "1시간 1분"
 *   - 나머지 초가 있을 경우: "H시간 M분 S초" 패턴
 *
 * 예시:
 * - 0        -> "0초"
 * - 59       -> "59초"
 * - 60       -> "1분"
 * - 90       -> "1분 30초"
 * - 3600     -> "1시간"
 * - 3660     -> "1시간 1분"
 * - 3661     -> "1시간 1분 1초"
 */
export function formatDurationFromSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0초";
  }

  const safeSeconds = Math.floor(totalSeconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}시간`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}분`);
  }

  if (seconds > 0) {
    parts.push(`${seconds}초`);
  }

  if (parts.length === 0) {
    return "0초";
  }

  return parts.join(" ");
}

/**
 * Date 객체를 API 요청용 문자열로 변환합니다.
 * 현재: "yyyy-MM-dd HH:mm:ss" 형식 (KST 기준)
 * TODO: API가 ISO UTC로 변경될 예정 → toISOString()으로 교체
 * @param date - 변환할 Date 객체
 */
export const formatDateForRequest = (date: Date): string => {
  return format(date, "yyyy-MM-dd HH:mm:ss");
};

/**
 * 로컬 시간 문자열을 UTC ISO 형식으로 변환합니다.
 *
 * @param localDateString - 로컬 시간 문자열 (yyyy-MM-dd HH:mm:ss 형식)
 * @returns UTC ISO 형식 문자열 또는 빈 문자열
 *
 * @example
 * // 로컬 시간대가 KST(+9)인 경우
 * toUtcIsoString("2024-01-15 09:00:00") // "2024-01-15T00:00:00.000Z"
 */
export function toUtcIsoString(localDateString: string): string {
  if (!localDateString) {
    return "";
  }

  const date = parse(localDateString, "yyyy-MM-dd HH:mm:ss", new Date());

  if (!isValid(date)) {
    return "";
  }

  return date.toISOString();
}
