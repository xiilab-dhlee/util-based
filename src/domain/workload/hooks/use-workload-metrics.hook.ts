"use client";

import { isNil } from "es-toolkit";

import { GetWorkloadResourceMetricsTimeseriesMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetWorkloadResourceMetricsTimeseries } from "@/api/generated/workspace-metrics/workspace-metrics";
import { calculateStep } from "@/domain/system-monitoring/utils/date-adapter.util";
import {
  ALL_WORKLOAD_METRICS,
  METRIC_EXTRACT_STATUS,
} from "@/domain/workload/constants/workload-monitoring.constant";
import type {
  MetricValue,
  WorkloadMetricSeries,
  WorkloadMetricSeriesGroup,
  WorkloadMetricsErrors,
} from "@/domain/workload/types/workload-metrics.type";
import {
  extractWorkloadMetricData,
  toSeriesName,
} from "@/domain/workload/utils/workload-metric-mapper.util";
import { formatDateForRequest } from "@/shared/utils/date.util";

interface UseWorkloadMetricsParams {
  workspaceId: number | null;
  workloadResourceName: string;
  dateRange: { start: Date; end: Date } | null;
  enabled?: boolean;
}

interface UseWorkloadMetricsReturn {
  /** 워크로드 메트릭 데이터 (4개 메트릭) */
  data: WorkloadMetricSeriesGroup;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 여부 (API 에러 또는 하나라도 메트릭 FAILED) */
  isError: boolean;
  /** 메트릭별 에러 상태 */
  errors: WorkloadMetricsErrors;
  /** 마지막 타임스탬프 (SSE 시작점) */
  lastTimestamp: string | null;
}

/**
 * 단일 메트릭 시리즈 생성 헬퍼
 */
function createSeries(
  metricName: GetWorkloadResourceMetricsTimeseriesMetricsItem,
  data: MetricValue[],
): WorkloadMetricSeries {
  return {
    seriesName: toSeriesName(metricName),
    metricName,
    data,
  };
}

export function useWorkloadMetrics({
  workspaceId,
  workloadResourceName,
  dateRange,
  enabled = true,
}: UseWorkloadMetricsParams): UseWorkloadMetricsReturn {
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
  } = useGetWorkloadResourceMetricsTimeseries(
    workspaceId ?? 0,
    workloadResourceName,
    {
      metrics: [...ALL_WORKLOAD_METRICS],
      startedAt,
      endedAt,
      step,
    },
    {
      query: {
        enabled:
          enabled &&
          Boolean(workspaceId) &&
          Boolean(workloadResourceName) &&
          !isNil(dateRange),
        staleTime: 7000,
        gcTime: 60000,
      },
    },
  );

  const gpuUtilResult = extractWorkloadMetricData(
    batchResponse,
    GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_UTILIZATION,
  );
  const gpuMemResult = extractWorkloadMetricData(
    batchResponse,
    GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_MEM_UTILIZATION,
  );
  const cpuUtilResult = extractWorkloadMetricData(
    batchResponse,
    GetWorkloadResourceMetricsTimeseriesMetricsItem.CPU_UTILIZATION,
  );
  const memUtilResult = extractWorkloadMetricData(
    batchResponse,
    GetWorkloadResourceMetricsTimeseriesMetricsItem.MEM_UTILIZATION,
  );

  const hasAnyMetricError =
    gpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    gpuMemResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED;

  // 여러 메트릭 중 첫 번째로 유효한 타임스탬프를 SSE 시작점으로 사용
  const lastTimestamp =
    gpuUtilResult.data.at(-1)?.dateTime ??
    gpuMemResult.data.at(-1)?.dateTime ??
    cpuUtilResult.data.at(-1)?.dateTime ??
    memUtilResult.data.at(-1)?.dateTime ??
    null;

  // 데이터가 모두 비어있는지 확인 (비활성 워크로드)
  const isEmpty =
    gpuUtilResult.data.length === 0 &&
    gpuMemResult.data.length === 0 &&
    cpuUtilResult.data.length === 0 &&
    memUtilResult.data.length === 0;

  return {
    data: {
      gpuUtilization: createSeries(
        GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_UTILIZATION,
        gpuUtilResult.data,
      ),
      gpuMemUtilization: createSeries(
        GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_MEM_UTILIZATION,
        gpuMemResult.data,
      ),
      cpuUtilization: createSeries(
        GetWorkloadResourceMetricsTimeseriesMetricsItem.CPU_UTILIZATION,
        cpuUtilResult.data,
      ),
      memUtilization: createSeries(
        GetWorkloadResourceMetricsTimeseriesMetricsItem.MEM_UTILIZATION,
        memUtilResult.data,
      ),
      isEmpty,
    },
    isLoading,
    isError: isQueryError || hasAnyMetricError,
    errors: {
      gpuUtilization: gpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      gpuMemUtilization: gpuMemResult.status === METRIC_EXTRACT_STATUS.FAILED,
      cpuUtilization: cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memUtilization: memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
    },
    lastTimestamp,
  };
}
