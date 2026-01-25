"use client";

import { isNil } from "es-toolkit";

import { useGetNodeGpuMetrics } from "@/api/generated/admin-cluster/admin-cluster";
import {
  ALL_GPU_METRICS,
  METRIC_EXTRACT_STATUS,
} from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type {
  AllGpuMetricsData,
  AllGpuMetricsErrors,
} from "@/domain/system-monitoring/types/metrics.type";
import { calculateStep } from "@/domain/system-monitoring/utils/date-adapter.util";
import { extractGpuMetricData } from "@/domain/system-monitoring/utils/metric-name-mapper.util";
import { formatDateForRequest } from "@/shared/utils/date.util";

interface UseAllGpuMetricsParams {
  nodeName: string;
  dateRange: { start: Date; end: Date } | null;
  enabled?: boolean;
}

interface UseAllGpuMetricsReturn {
  /** 메트릭별 GPU 데이터 */
  data: AllGpuMetricsData;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 여부 (API 에러 또는 하나라도 메트릭 FAILED) */
  isError: boolean;
  /** 메트릭별 에러 상태 */
  errors: AllGpuMetricsErrors;
  /** 마지막 타임스탬프 (SSE 시작점) */
  lastTimestamp: string | null;
}

export function useAllGpuMetrics({
  nodeName,
  dateRange,
  enabled = true,
}: UseAllGpuMetricsParams): UseAllGpuMetricsReturn {
  // dateRange가 null이면 쿼리가 비활성화되므로 placeholder 값 사용
  const startedAt = isNil(dateRange)
    ? ""
    : formatDateForRequest(dateRange.start);
  const endedAt = isNil(dateRange) ? "" : formatDateForRequest(dateRange.end);
  const step = isNil(dateRange)
    ? ""
    : calculateStep(dateRange.start, dateRange.end);

  const {
    data: batchResponse,
    isLoading,
    isError: isQueryError,
  } = useGetNodeGpuMetrics(
    nodeName,
    {
      metrics: [...ALL_GPU_METRICS],
      startedAt,
      endedAt,
      step,
    },
    {
      query: {
        enabled: enabled && Boolean(nodeName) && !isNil(dateRange),
        staleTime: 7000, // 7초
        gcTime: 60000, // 1분
      },
    },
  );

  const utilizationResult = extractGpuMetricData(
    batchResponse,
    "gpu-utilization",
  );
  const memoryResult = extractGpuMetricData(batchResponse, "gpu-memory");
  const temperatureResult = extractGpuMetricData(
    batchResponse,
    "gpu-temperature",
  );
  const powerUsageResult = extractGpuMetricData(
    batchResponse,
    "gpu-power-usage",
  );

  const hasAnyMetricError =
    utilizationResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    memoryResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    temperatureResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    powerUsageResult.status === METRIC_EXTRACT_STATUS.FAILED;

  const lastTimestamp =
    utilizationResult.data[0]?.values?.at(-1)?.dateTime ??
    memoryResult.data[0]?.values?.at(-1)?.dateTime ??
    temperatureResult.data[0]?.values?.at(-1)?.dateTime ??
    powerUsageResult.data[0]?.values?.at(-1)?.dateTime ??
    null;

  return {
    data: {
      utilization: utilizationResult.data,
      memory: memoryResult.data,
      temperature: temperatureResult.data,
      powerUsage: powerUsageResult.data,
    },
    isLoading,
    isError: isQueryError || hasAnyMetricError,
    errors: {
      utilization: utilizationResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memory: memoryResult.status === METRIC_EXTRACT_STATUS.FAILED,
      temperature: temperatureResult.status === METRIC_EXTRACT_STATUS.FAILED,
      powerUsage: powerUsageResult.status === METRIC_EXTRACT_STATUS.FAILED,
    },
    lastTimestamp,
  };
}
