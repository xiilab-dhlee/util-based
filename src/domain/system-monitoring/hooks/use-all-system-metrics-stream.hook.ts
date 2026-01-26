"use client";

import { useEffect, useState } from "react";

import {
  type BatchSystemMetricResponse,
  GetNodeSystemMetricsMetricsItem,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ALL_SYSTEM_METRICS,
  DEFAULT_BUFFER_SIZE,
  METRIC_EXTRACT_STATUS,
} from "@/domain/system-monitoring/constants/system-monitoring.constant";
import { useSSEConnection } from "@/domain/system-monitoring/hooks/use-sse-connection.hook";
import { useSystemMetricBuffers } from "@/domain/system-monitoring/hooks/use-system-metric-buffers.hook";
import type {
  AllSystemMetricsErrors,
  SystemMetricSeries,
  SystemMetricSeriesGroup,
} from "@/domain/system-monitoring/types/metrics.type";
import {
  extractSystemMetricData,
  toSeriesName,
} from "@/domain/system-monitoring/utils/metric-name-mapper.util";
import type { RingBufferState } from "@/domain/system-monitoring/utils/ring-buffer.util";
import { SSE_BASE_URL, SSE_ENDPOINTS } from "@/shared/constants/sse.constant";

interface UseAllSystemMetricsStreamParams {
  /** 노드명 */
  nodeName: string;
  /** History API에서 조회한 마지막 타임스탬프 (SSE 시작점) */
  lastHistoryTimestamp: string | null;
  /** 초기 데이터 (Live 모드 진입 시 History 데이터로 버퍼 초기화) */
  initialData?: SystemMetricSeriesGroup;
  /** 쿼리 활성화 여부 */
  enabled?: boolean;
  /** 버퍼 최대 크기 (기본: DEFAULT_BUFFER_SIZE) */
  bufferSize?: number;
}

interface UseAllSystemMetricsStreamReturn {
  /** 시스템 메트릭 데이터 (그룹별) */
  data: SystemMetricSeriesGroup;
  /** SSE 연결 상태 */
  isConnected: boolean;
  /** 에러 여부 (SSE 연결 에러) */
  isError: boolean;
  /** 에러 메시지 (SSE 연결 에러) */
  error: string | null;
  /** 메트릭별 에러 상태 */
  errors: AllSystemMetricsErrors;
}

/**
 * 버퍼에서 SystemMetricSeries 생성
 */
function createSeriesFromBuffer<T extends { dateTime: string; value: string }>(
  metricName: GetNodeSystemMetricsMetricsItem,
  buffer: RingBufferState<T>,
): SystemMetricSeries {
  return {
    seriesName: toSeriesName(metricName),
    metricName,
    data: buffer.data,
  };
}

/**
 * 모든 시스템 메트릭을 단일 SSE 연결로 스트리밍하는 훅
 *
 * 6개 시스템 메트릭을 하나의 SSE 연결로 수신하여 네트워크 효율성을 높입니다.
 * 각 메트릭별로 링 버퍼를 관리합니다.
 *
 * @example
 * const { data, isConnected } = useAllSystemMetricsStream({
 *   nodeName: "node-1",
 *   lastHistoryTimestamp: "2025-01-16T10:30:00",
 *   initialData: systemMetrics.data,
 *   enabled: dateMode === "live",
 * });
 */
export function useAllSystemMetricsStream({
  nodeName,
  lastHistoryTimestamp,
  initialData,
  enabled = true,
  bufferSize = DEFAULT_BUFFER_SIZE,
}: UseAllSystemMetricsStreamParams): UseAllSystemMetricsStreamReturn {
  const [metricErrors, setMetricErrors] = useState<AllSystemMetricsErrors>({
    cpuUtilization: false,
    cpuTemperature: false,
    memoryUtilization: false,
    diskUtilization: false,
    diskRw: false,
  });

  const { buffers, updateBuffers, initFromData, resetBuffers } =
    useSystemMetricBuffers({
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
        cpuUtilization: false,
        cpuTemperature: false,
        memoryUtilization: false,
        diskUtilization: false,
        diskRw: false,
      });
    }
  }, [enabled, resetBuffers]);

  const sseUrl = (() => {
    if (!nodeName || !SSE_BASE_URL) return "";
    const effectiveLastSentTime =
      lastHistoryTimestamp ?? new Date().toISOString();
    const url = new URL(SSE_ENDPOINTS.systemMetrics(nodeName), SSE_BASE_URL);
    url.searchParams.set("metrics", ALL_SYSTEM_METRICS.join(","));
    url.searchParams.set("lastSentTime", effectiveLastSentTime);
    return url.toString();
  })();

  const handleMessage = (batchResponse: BatchSystemMetricResponse) => {
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

    setMetricErrors({
      cpuUtilization: cpuUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      cpuTemperature: cpuTempResult.status === METRIC_EXTRACT_STATUS.FAILED,
      memoryUtilization: memUtilResult.status === METRIC_EXTRACT_STATUS.FAILED,
      diskUtilization: diskUsageResult.status === METRIC_EXTRACT_STATUS.FAILED,
      diskRw:
        diskReadResult.status === METRIC_EXTRACT_STATUS.FAILED ||
        diskWriteResult.status === METRIC_EXTRACT_STATUS.FAILED,
    });

    updateBuffers({
      cpuUtilization: cpuUtilResult.data,
      cpuTemperature: cpuTempResult.data,
      memoryUtilization: memUtilResult.data,
      diskUtilization: diskUsageResult.data,
      diskRead: diskReadResult.data,
      diskWrite: diskWriteResult.data,
    });
  };

  const {
    isConnected,
    isError: connectionError,
    error: connectionErrorMsg,
  } = useSSEConnection<BatchSystemMetricResponse>({
    url: sseUrl,
    eventName: "system-metrics",
    enabled: enabled && !!nodeName,
    onMessage: handleMessage,
  });

  const hasAnyError =
    metricErrors.cpuUtilization ||
    metricErrors.cpuTemperature ||
    metricErrors.memoryUtilization ||
    metricErrors.diskUtilization ||
    metricErrors.diskRw;

  const data: SystemMetricSeriesGroup = {
    cpuUtilization: createSeriesFromBuffer(
      GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION,
      buffers.cpuUtilization,
    ),
    cpuTemperature: createSeriesFromBuffer(
      GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE,
      buffers.cpuTemperature,
    ),
    memoryUtilization: createSeriesFromBuffer(
      GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION,
      buffers.memoryUtilization,
    ),
    diskUtilization: createSeriesFromBuffer(
      GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION,
      buffers.diskUtilization,
    ),
    diskRw: [
      createSeriesFromBuffer(
        GetNodeSystemMetricsMetricsItem.DISK_READ,
        buffers.diskRead,
      ),
      createSeriesFromBuffer(
        GetNodeSystemMetricsMetricsItem.DISK_WRITE,
        buffers.diskWrite,
      ),
    ],
  };

  return {
    data,
    isConnected,
    isError: connectionError || hasAnyError,
    error: connectionErrorMsg,
    errors: metricErrors,
  };
}
