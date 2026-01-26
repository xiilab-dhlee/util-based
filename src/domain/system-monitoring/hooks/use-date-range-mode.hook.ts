"use client";

import { startOfMinute } from "date-fns";
import { useEffect, useState } from "react";

import { LIVE_HISTORY_DEFAULT_RANGE } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import { normalizeMonitoringHistoryRange } from "@/domain/system-monitoring/utils/system-monitoring.util";
import {
  DEFAULT_DATE_RANGE_MS,
  HISTORY_MODE,
  LIVE_MODE,
} from "@/shared/constants/core.constant";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

interface DateRange {
  start: Date;
  end: Date;
}

interface UseDateRangeModeReturn {
  dateMode: MonitoringDateMode;
  dateRange: DateRange | null;
  isLiveMode: boolean;
  apiDateRange: DateRange | null;
  isApiReady: boolean;
  /** 날짜 모드 토글 핸들러 */
  handleToggleDateMode: () => void;
  /** 날짜 범위 변경 핸들러 (DatePicker용) */
  handleChangeDateRange: (startDate: Date | null, endDate: Date | null) => void;
  /** 차트에서 범위 변경 시 핸들러 (자동으로 History 모드 전환) */
  handleChangeRangeFromChart: (range: DateRange) => void;
}

/**
 * 모니터링 날짜 모드 및 범위를 관리하는 훅
 *
 * - Live/History 모드 전환
 * - Live 모드 진입 시 liveHistoryRange 계산 (Hydration 안전)
 * - 날짜 범위 정규화 (최소 1분 보장)
 * - 차트에서 범위 선택 시 자동 History 모드 전환
 */
export function useDateRangeMode(): UseDateRangeModeReturn {
  const [dateMode, setDateMode] = useState<MonitoringDateMode>(LIVE_MODE);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [liveHistoryRange, setLiveHistoryRange] = useState<DateRange | null>(
    null,
  );

  useEffect(() => {
    setDateRange({
      start: startOfMinute(new Date(Date.now() - DEFAULT_DATE_RANGE_MS)),
      end: startOfMinute(new Date()),
    });
  }, []);

  useEffect(() => {
    if (dateMode === LIVE_MODE) {
      setLiveHistoryRange({
        start: new Date(Date.now() - LIVE_HISTORY_DEFAULT_RANGE),
        end: new Date(),
      });
    } else {
      setLiveHistoryRange(null);
    }
  }, [dateMode]);

  const handleToggleDateMode = () => {
    setDateMode((prev) => (prev === LIVE_MODE ? HISTORY_MODE : LIVE_MODE));
  };

  const handleChangeDateRange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    if (!startDate || !endDate) return;
    if (dateMode === LIVE_MODE) return;

    const normalizedRange = normalizeMonitoringHistoryRange({
      start: startDate,
      end: endDate,
    });

    setDateRange(normalizedRange);
  };

  const handleChangeRangeFromChart = (range: DateRange) => {
    setDateMode((prevMode) => {
      if (prevMode === LIVE_MODE) {
        return HISTORY_MODE;
      }
      return prevMode;
    });

    const normalizedRange = normalizeMonitoringHistoryRange(range);
    setDateRange(normalizedRange);
  };

  const isLiveMode = dateMode === LIVE_MODE;
  const apiDateRange =
    dateMode === HISTORY_MODE ? dateRange : (liveHistoryRange ?? dateRange);
  const isApiReady =
    (dateMode === HISTORY_MODE && dateRange !== null) ||
    (dateMode === LIVE_MODE && liveHistoryRange !== null);

  return {
    dateMode,
    dateRange,
    isLiveMode,
    apiDateRange,
    isApiReady,
    handleToggleDateMode,
    handleChangeDateRange,
    handleChangeRangeFromChart,
  };
}
