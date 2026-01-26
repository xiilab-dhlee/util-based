import { MAX_CHART_POINTS } from "@/domain/system-monitoring/constants/system-monitoring.constant";

/**
 * 조회 기간에 따른 Prometheus step 계산
 *
 * 최대 MAX_CHART_POINTS개의 데이터 포인트를 반환하도록
 * 정확한 step 값을 계산합니다.
 *
 * @param startDate - 시작 시간
 * @param endDate - 종료 시간
 * @returns Prometheus step 문자열 (예: "1s", "623s")
 */
export function calculateStep(startDate: Date, endDate: Date): string {
  const diffSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
  if (diffSeconds <= 0) {
    return "1s";
  }
  const stepSeconds = Math.max(1, Math.ceil(diffSeconds / MAX_CHART_POINTS));
  return `${stepSeconds}s`;
}
