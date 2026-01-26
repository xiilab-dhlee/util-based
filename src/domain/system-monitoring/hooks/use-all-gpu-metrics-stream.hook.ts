"use client";

import { useEffect, useState } from "react";

import type { BatchGpuMetricResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ALL_GPU_METRICS,
  DEFAULT_BUFFER_SIZE,
  METRIC_EXTRACT_STATUS,
} from "@/domain/system-monitoring/constants/system-monitoring.constant";
import { useGpuMetricBuffers } from "@/domain/system-monitoring/hooks/use-gpu-metric-buffers.hook";
import { useSSEConnection } from "@/domain/system-monitoring/hooks/use-sse-connection.hook";
import type {
  AllGpuMetricsData,
  AllGpuMetricsErrors,
} from "@/domain/system-monitoring/types/metrics.type";
import { extractGpuMetricData } from "@/domain/system-monitoring/utils/metric-name-mapper.util";
import { SSE_BASE_URL, SSE_ENDPOINTS } from "@/shared/constants/sse.constant";

interface UseAllGpuMetricsStreamParams {
  /** 노드명 */
  nodeName: string;
  /** History API에서 조회한 마지막 타임스탬프 (SSE 시작점) */
  lastHistoryTimestamp: string | null;
  /** 초기 데이터 (Live 모드 진입 시 History 데이터로 버퍼 초기화) */
  initialData?: AllGpuMetricsData;
  /** 쿼리 활성화 여부 */
  enabled?: boolean;
  /** 버퍼 최대 크기 (기본: DEFAULT_BUFFER_SIZE) */
  bufferSize?: number;
}

/** 메트릭별 GPU 버퍼 데이터 (AllGpuMetricsData와 동일) */
export type AllGpuMetricsStreamData = AllGpuMetricsData;

interface UseAllGpuMetricsStreamReturn {
  /** 메트릭별 GPU 데이터 (버퍼 기반) */
  data: AllGpuMetricsStreamData;
  /** SSE 연결 상태 */
  isConnected: boolean;
  /** 에러 여부 (SSE 연결 에러) */
  isError: boolean;
  /** 에러 메시지 (SSE 연결 에러) */
  error: string | null;
  /** 메트릭별 에러 상태 */
  errors: AllGpuMetricsErrors;
}

export function useAllGpuMetricsStream({
  nodeName,
  lastHistoryTimestamp,
  initialData,
  enabled = true,
  bufferSize = DEFAULT_BUFFER_SIZE,
}: UseAllGpuMetricsStreamParams): UseAllGpuMetricsStreamReturn {
  const [metricErrors, setMetricErrors] = useState<AllGpuMetricsErrors>({
    utilization: false,
    memory: false,
    temperature: false,
    powerUsage: false,
  });

  const {
    buffers,
    updateBuffers,
    initFromData,
    resetBuffers,
    toGpuTimeseriesData,
  } = useGpuMetricBuffers({
    bufferSize,
    nodeName,
  });

  useEffect(() => {
    if (enabled && initialData) {
      initFromData(initialData);
    }
  }, [enabled, initialData, initFromData]);

  useEffect(() => {
    if (!enabled) {
      resetBuffers();
      setMetricErrors({
        utilization: false,
        memory: false,
        temperature: false,
        powerUsage: false,
      });
    }
  }, [enabled, resetBuffers]);

  const sseUrl = (() => {
    if (!nodeName || !SSE_BASE_URL) return "";
    const effectiveLastSentTime =
      lastHistoryTimestamp ?? new Date().toISOString();
    const url = new URL(SSE_ENDPOINTS.gpuMetrics(nodeName), SSE_BASE_URL);
    url.searchParams.set("metrics", ALL_GPU_METRICS.join(","));
    url.searchParams.set("lastSentTime", effectiveLastSentTime);
    return url.toString();
  })();

  const handleMessage = (batchResponse: BatchGpuMetricResponse) => {
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

    setMetricErrors({
      utilization: utilizationResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memory: memoryResult.status === METRIC_EXTRACT_STATUS.FAILED,
      temperature: temperatureResult.status === METRIC_EXTRACT_STATUS.FAILED,
      powerUsage: powerUsageResult.status === METRIC_EXTRACT_STATUS.FAILED,
    });

    updateBuffers({
      utilization: utilizationResult.data,
      memory: memoryResult.data,
      temperature: temperatureResult.data,
      powerUsage: powerUsageResult.data,
    });
  };

  const {
    isConnected,
    isError: connectionError,
    error: connectionErrorMsg,
  } = useSSEConnection<BatchGpuMetricResponse>({
    url: sseUrl,
    eventName: "gpu-metrics",
    enabled: enabled && !!nodeName,
    onMessage: handleMessage,
  });

  const data: AllGpuMetricsStreamData = {
    utilization: toGpuTimeseriesData(buffers.utilization),
    memory: toGpuTimeseriesData(buffers.memory),
    temperature: toGpuTimeseriesData(buffers.temperature),
    powerUsage: toGpuTimeseriesData(buffers.powerUsage),
  };

  return {
    data,
    isConnected,
    isError: connectionError,
    error: connectionErrorMsg,
    errors: metricErrors,
  };
}
