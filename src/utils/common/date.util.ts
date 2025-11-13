import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
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
