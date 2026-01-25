"use client";

import { isNil } from "es-toolkit";

import { useGetNodeSystemMetrics } from "@/api/generated/admin-cluster/admin-cluster";
import { GetNodeSystemMetricsMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ALL_SYSTEM_METRICS,
  METRIC_EXTRACT_STATUS,
} from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type {
  AllSystemMetricsErrors,
  MetricValue,
  SystemMetricSeries,
  SystemMetricSeriesGroup,
} from "@/domain/system-monitoring/types/metrics.type";
import { calculateStep } from "@/domain/system-monitoring/utils/date-adapter.util";
import {
  extractSystemMetricData,
  toSeriesName,
} from "@/domain/system-monitoring/utils/metric-name-mapper.util";
import { formatDateForRequest } from "@/shared/utils/date.util";

interface UseAllSystemMetricsParams {
  nodeName: string;
  dateRange: { start: Date; end: Date } | null;
  enabled?: boolean;
}

interface UseAllSystemMetricsReturn {
  /** 시스템 메트릭 데이터 (그룹별) */
  data: SystemMetricSeriesGroup;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 여부 (API 에러 또는 하나라도 메트릭 FAILED) */
  isError: boolean;
  /** 메트릭별 에러 상태 */
  errors: AllSystemMetricsErrors;
  /** 마지막 타임스탬프 (SSE 시작점) */
  lastTimestamp: string | null;
}

/**
 * 단일 메트릭 시리즈 생성 헬퍼
 */
function createSeries(
  metricName: GetNodeSystemMetricsMetricsItem,
  data: MetricValue[],
): SystemMetricSeries {
  return {
    seriesName: toSeriesName(metricName),
    metricName,
    data,
  };
}

/**
 * 모든 시스템 메트릭을 한번의 API 호출로 조회하는 훅
 *
 * 6개 시스템 메트릭 (CPU, Memory, Disk)을 단일 API 호출로 조회하여
 * 네트워크 효율성을 높입니다.
 *
 * @example
 * const { data, isLoading, lastTimestamp } = useAllSystemMetrics({
 *   nodeName: "node-1",
 *   dateRange: { start: new Date(), end: new Date() },
 *   enabled: true,
 * });
 *
 * // 각 메트릭 데이터 접근
 * const cpuData = data.cpuUtilization;
 * const diskRwData = data.diskRw; // [Read, Write] 배열
 */
export function useAllSystemMetrics({
  nodeName,
  dateRange,
  enabled = true,
}: UseAllSystemMetricsParams): UseAllSystemMetricsReturn {
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
  } = useGetNodeSystemMetrics(
    nodeName,
    {
      metrics: [...ALL_SYSTEM_METRICS],
      startedAt,
      endedAt,
      step,
    },
    {
      query: {
        enabled: enabled && Boolean(nodeName) && !isNil(dateRange),
        staleTime: 7000,
        gcTime: 60000,
      },
    },
  );

  const cpuUtilResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION,
  );
  const cpuTempResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE,
  );
  const memUtilResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION,
  );
  const diskUsageResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION,
  );
  const diskReadResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.DISK_READ,
  );
  const diskWriteResult = extractSystemMetricData(
    batchResponse,
    GetNodeSystemMetricsMetricsItem.DISK_WRITE,
  );

  const hasAnyMetricError =
    cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    cpuTempResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    diskUsageResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    diskReadResult.status === METRIC_EXTRACT_STATUS.FAILED ||
    diskWriteResult.status === METRIC_EXTRACT_STATUS.FAILED;

  // 여러 메트릭 중 첫 번째로 유효한 타임스탬프를 SSE 시작점으로 사용
  const lastTimestamp =
    cpuUtilResult.data.at(-1)?.dateTime ??
    cpuTempResult.data.at(-1)?.dateTime ??
    memUtilResult.data.at(-1)?.dateTime ??
    diskUsageResult.data.at(-1)?.dateTime ??
    diskReadResult.data.at(-1)?.dateTime ??
    diskWriteResult.data.at(-1)?.dateTime ??
    null;

  return {
    data: {
      cpuUtilization: createSeries(
        GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION,
        cpuUtilResult.data,
      ),
      cpuTemperature: createSeries(
        GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE,
        cpuTempResult.data,
      ),
      memoryUtilization: createSeries(
        GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION,
        memUtilResult.data,
      ),
      diskUtilization: createSeries(
        GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION,
        diskUsageResult.data,
      ),
      diskRw: [
        createSeries(
          GetNodeSystemMetricsMetricsItem.DISK_READ,
          diskReadResult.data,
        ),
        createSeries(
          GetNodeSystemMetricsMetricsItem.DISK_WRITE,
          diskWriteResult.data,
        ),
      ],
    },
    isLoading,
    isError: isQueryError || hasAnyMetricError,
    errors: {
      cpuUtilization: cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      cpuTemperature: cpuTempResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memoryUtilization: memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      diskUtilization: diskUsageResult.status === METRIC_EXTRACT_STATUS.FAILED,
      diskRw:
        diskReadResult.status === METRIC_EXTRACT_STATUS.FAILED ||
        diskWriteResult.status === METRIC_EXTRACT_STATUS.FAILED,
    },
    lastTimestamp,
  };
}
