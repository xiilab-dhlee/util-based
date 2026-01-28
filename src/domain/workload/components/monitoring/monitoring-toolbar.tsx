"use client";

import type { ChartDateRangeValue } from "@/shared/components/chart-date-range";
import { ChartDateRange } from "@/shared/components/chart-date-range";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

interface MonitoringToolbarProps {
  /** 날짜 모드 (live | history) */
  dateMode: MonitoringDateMode;
  /** 날짜 범위 (히스토리 모드용) */
  dateRange: ChartDateRangeValue | null;
  /** 날짜 모드 토글 핸들러 */
  onToggleDateMode: () => void;
  /** 날짜 범위 변경 핸들러 */
  onChangeDateRange: (startDate: Date | null, endDate: Date | null) => void;
  /** 종료된 워크로드 여부 (라이브 모드 비활성화) */
  isTerminated?: boolean;
}

/**
 * 워크로드 모니터링 툴바 컴포넌트
 *
 * 라이브/히스토리 모드 전환과 날짜 범위 선택 기능을 제공합니다.
 * 종료된 워크로드는 라이브 모드를 지원하지 않습니다.
 */
export function MonitoringToolbar({
  dateMode,
  dateRange,
  onToggleDateMode,
  onChangeDateRange,
  isTerminated = false,
}: MonitoringToolbarProps) {
  const shouldShowDateRange = (
    value: ChartDateRangeValue | null,
  ): value is ChartDateRangeValue => Boolean(value);

  if (!shouldShowDateRange(dateRange)) {
    return null;
  }

  // 종료된 워크로드는 라이브 모드 토글 비활성화
  const handleToggleMode = isTerminated ? () => {} : onToggleDateMode;

  return (
    <ChartDateRange
      mode={dateMode}
      value={dateRange}
      onToggleMode={handleToggleMode}
      onChangeRange={onChangeDateRange}
      height={30}
      width={270}
      withTime
    />
  );
}
