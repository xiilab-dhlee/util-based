"use client";

import { useEffect, useMemo, useState } from "react";

import type { BatchWorkloadMetricsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GetWorkloadResourceMetricsTimeseriesMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useSSEConnection } from "@/domain/system-monitoring/hooks/use-sse-connection.hook";
import type { RingBufferState } from "@/domain/system-monitoring/utils/ring-buffer.util";
import {
  ALL_WORKLOAD_METRICS,
  DEFAULT_BUFFER_SIZE,
  METRIC_EXTRACT_STATUS,
} from "@/domain/workload/constants/workload-monitoring.constant";
import { useWorkloadMetricBuffers } from "@/domain/workload/hooks/use-workload-metric-buffers.hook";
import type {
  WorkloadMetricSeries,
  WorkloadMetricSeriesGroup,
  WorkloadMetricsErrors,
} from "@/domain/workload/types/workload-metrics.type";
import {
  extractWorkloadMetricData,
  toSeriesName,
} from "@/domain/workload/utils/workload-metric-mapper.util";
import { SSE_BASE_URL } from "@/shared/constants/sse.constant";

interface UseWorkloadMetricsStreamParams {
  /** 워크스페이스 ID */
  workspaceId: number | null;
  /** 워크로드 리소스 이름 */
  workloadResourceName: string;
  /** History API에서 조회한 마지막 타임스탬프 (SSE 시작점) */
  lastHistoryTimestamp: string | null;
  /** 초기 데이터 (Live 모드 진입 시 History 데이터로 버퍼 초기화) */
  initialData?: WorkloadMetricSeriesGroup;
  /** 쿼리 활성화 여부 */
  enabled?: boolean;
  /** 버퍼 최대 크기 (기본: 5000) */
  bufferSize?: number;
}

interface UseWorkloadMetricsStreamReturn {
  /** 워크로드 메트릭 데이터 (4개 메트릭) */
  data: WorkloadMetricSeriesGroup;
  /** SSE 연결 상태 */
  isConnected: boolean;
  /** 에러 여부 (SSE 연결 에러) */
  isError: boolean;
  /** 에러 메시지 (SSE 연결 에러) */
  error: string | null;
  /** 메트릭별 에러 상태 */
  errors: WorkloadMetricsErrors;
}

/**
 * 버퍼에서 WorkloadMetricSeries 생성
 */
function createSeriesFromBuffer(
  metricName: GetWorkloadResourceMetricsTimeseriesMetricsItem,
  buffer: RingBufferState<{
    dateTime: string;
    value: string;
    podName?: string;
    gpuIndex?: string;
    modelName?: string;
  }>,
): WorkloadMetricSeries {
  return {
    seriesName: toSeriesName(metricName),
    metricName,
    data: buffer.data,
  };
}

/**
 * 모든 워크로드 메트릭을 단일 SSE 연결로 스트리밍하는 훅 (라이브 모드)
 *
 * 4개 워크로드 메트릭을 하나의 SSE 연결로 수신하여 네트워크 효율성을 높입니다.
 * 각 메트릭별로 링 버퍼를 관리합니다.
 *
 * @example
 * const { data, isConnected } = useWorkloadMetricsStream({
 *   workspaceId: 1,
 *   workloadResourceName: "workload-123",
 *   lastHistoryTimestamp: "2025-01-27T10:30:00",
 *   initialData: workloadMetrics.data,
 *   enabled: dateMode === "live",
 * });
 */
export function useWorkloadMetricsStream({
  workspaceId,
  workloadResourceName,
  lastHistoryTimestamp,
  initialData,
  enabled = true,
  bufferSize = DEFAULT_BUFFER_SIZE,
}: UseWorkloadMetricsStreamParams): UseWorkloadMetricsStreamReturn {
  const [metricErrors, setMetricErrors] = useState<WorkloadMetricsErrors>({
    gpuUtilization: false,
    gpuMemUtilization: false,
    cpuUtilization: false,
    memUtilization: false,
  });

  const { buffers, updateBuffers, initFromData, resetBuffers } =
    useWorkloadMetricBuffers({
      bufferSize,
      workloadResourceName,
    });

  // 초기 데이터로 버퍼 초기화
  useEffect(() => {
    if (enabled && initialData) {
      initFromData(initialData);
    }
  }, [enabled, initialData, initFromData]);

  // 비활성화 시 버퍼 리셋
  useEffect(() => {
    if (!enabled) {
      resetBuffers();
      setMetricErrors({
        gpuUtilization: false,
        gpuMemUtilization: false,
        cpuUtilization: false,
        memUtilization: false,
      });
    }
  }, [enabled, resetBuffers]);

  // SSE URL 생성
  const sseUrl = useMemo(() => {
    if (!enabled || !workspaceId || !workloadResourceName || !SSE_BASE_URL)
      return "";

    const effectiveLastSentTime =
      lastHistoryTimestamp ?? new Date().toISOString();
    const url = new URL(
      `/sse/v1/workspaces/${workspaceId}/workloads/${workloadResourceName}/resources/metrics/stream`,
      SSE_BASE_URL,
    );
    url.searchParams.set("metrics", ALL_WORKLOAD_METRICS.join(","));
    url.searchParams.set("lastSentTime", effectiveLastSentTime);
    return url.toString();
  }, [enabled, workspaceId, workloadResourceName, lastHistoryTimestamp]);

  // SSE 메시지 핸들러
  const handleMessage = (batchResponse: BatchWorkloadMetricsResponse) => {
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

    setMetricErrors({
      gpuUtilization: gpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      gpuMemUtilization: gpuMemResult.status === METRIC_EXTRACT_STATUS.FAILED,
      cpuUtilization: cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memUtilization: memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
    });

    updateBuffers({
      gpuUtilization: gpuUtilResult.data,
      gpuMemUtilization: gpuMemResult.data,
      cpuUtilization: cpuUtilResult.data,
      memUtilization: memUtilResult.data,
    });
  };

  // SSE 연결
  const {
    isConnected,
    isError: connectionError,
    error: connectionErrorMsg,
  } = useSSEConnection<BatchWorkloadMetricsResponse>({
    url: sseUrl,
    eventName: "workload-metrics",
    enabled: enabled && !!sseUrl,
    onMessage: handleMessage,
  });

  const hasAnyError =
    metricErrors.gpuUtilization ||
    metricErrors.gpuMemUtilization ||
    metricErrors.cpuUtilization ||
    metricErrors.memUtilization;

  const data: WorkloadMetricSeriesGroup = {
    gpuUtilization: createSeriesFromBuffer(
      GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_UTILIZATION,
      buffers.gpuUtilization,
    ),
    gpuMemUtilization: createSeriesFromBuffer(
      GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_MEM_UTILIZATION,
      buffers.gpuMemUtilization,
    ),
    cpuUtilization: createSeriesFromBuffer(
      GetWorkloadResourceMetricsTimeseriesMetricsItem.CPU_UTILIZATION,
      buffers.cpuUtilization,
    ),
    memUtilization: createSeriesFromBuffer(
      GetWorkloadResourceMetricsTimeseriesMetricsItem.MEM_UTILIZATION,
      buffers.memUtilization,
    ),
  };

  return {
    data,
    isConnected,
    isError: connectionError || hasAnyError,
    error: connectionErrorMsg,
    errors: metricErrors,
  };
}
