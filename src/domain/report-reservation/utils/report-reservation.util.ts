import type { DispatchDay } from "@/domain/report-reservation/schemas/report-reservation.schema";

/**
 * 발송 주기 표시 문자열 생성
 *
 * @param dispatchCycle - 발송주기 ("1주", "1개월", "3일" 등)
 * @param dispatchDay - 발송일 ("월요일", "15일", null)
 * @returns 포맷팅된 발송 주기 문자열
 *
 * @example
 * formatDispatchSchedule("1주", "월요일") // "매 1주마다 월요일"
 * formatDispatchSchedule("1개월", "15일") // "매 1개월마다 15일"
 * formatDispatchSchedule("3일", null)     // "매 3일마다"
 */
export function formatDispatchSchedule(
  dispatchCycle: string,
  dispatchDay: DispatchDay,
): string {
  if (dispatchDay) {
    return `매 ${dispatchCycle}마다 ${dispatchDay}`;
  }
  return `매 ${dispatchCycle}마다`;
}
