"use client";

import { useQuery } from "@tanstack/react-query";

import { systemMonitoringService } from "@/domain/system-monitoring/api/system-monitoring.service";
import { systemMonitoringKeys } from "@/domain/system-monitoring/constants/system-monitoring.key";
import type {
  GetMetricsPayload,
  ResourceMetricResponse,
  SystemResourcesSummaryResponse,
} from "@/domain/system-monitoring/types/system-monitoring.type";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

const LIVE_WINDOW_MS = 24 * 60 * 60 * 1000; // 1일
const LIVE_REFETCH_INTERVAL_MS = 3000; // 3초

/**
 * 노드 요약 정보 조회 훅
 * @param nodeName - 조회할 노드명
 */
export function useNodeSummary(nodeName: string) {
  return useQuery<{ data: SystemResourcesSummaryResponse }>({
    queryKey: systemMonitoringKeys.nodeSummary(nodeName),
    queryFn: () => systemMonitoringService.getSystemResourcesSummary(nodeName),
    enabled: !!nodeName,
    staleTime: 60000, // 60초
    gcTime: 300000, // 5분
  });
}

interface UseResourceMetricsWithModeParams {
  /** live | history 모드 */
  mode: MonitoringDateMode;
  /** 조회할 노드명 */
  nodeName: string;
  /** 메트릭 타입 */
  metricName: string;
  /** history 모드에서 사용할 기간 */
  historyRange: {
    start: Date;
    end: Date;
  };
  /** GPU 필터 (선택) */
  gpuName?: string[];
}

/**
 * 모드(LIVE / HISTORY)에 따라 동작이 달라지는 리소스 메트릭 조회 훅
 *
 * - LIVE 모드:
 *   - 현재 시각 기준 과거 1일(24시간)을 윈도우로 조회
 *   - 3초(refetchInterval)마다 같은 윈도우로 재조회
 * - HISTORY 모드:
 *   - 상위에서 내려준 historyRange(start/end)를 그대로 사용
 *   - range가 변경될 때마다 새로 조회
 */
export function useResourceMetricsWithMode({
  mode,
  nodeName,
  metricName,
  historyRange,
  gpuName,
}: UseResourceMetricsWithModeParams) {
  const hasNodeAndMetric = !!nodeName && !!metricName;
  const isEnabled =
    hasNodeAndMetric && (!metricName.startsWith("gpu-") || !!gpuName?.length);

  let startDateTime: Date;
  let endDateTime: Date;

  if (mode === "history") {
    startDateTime = historyRange.start;
    endDateTime = historyRange.end;
  } else {
    endDateTime = new Date();
    startDateTime = new Date(endDateTime.getTime() - LIVE_WINDOW_MS);
  }

  const payload: GetMetricsPayload = {
    nodeName,
    metricName,
    startDateTime,
    endDateTime,
    gpuName,
  };

  return useQuery<{ data: ResourceMetricResponse[] }>({
    queryKey: systemMonitoringKeys.resourceMetrics(payload),
    queryFn: () => systemMonitoringService.getResourceMetrics(payload),
    enabled: isEnabled,
    gcTime: 60000, // 1분
    ...(mode === "history"
      ? {
          // history 모드는 refetchInterval 없이, 기간 변경 시에만 조회
          staleTime: 7000, // 7초
        }
      : {
          // LIVE 모드
          refetchInterval: LIVE_REFETCH_INTERVAL_MS,
          refetchIntervalInBackground: true,
          staleTime: 0,
        }),
  });
}
