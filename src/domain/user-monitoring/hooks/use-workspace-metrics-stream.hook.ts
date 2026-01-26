import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TimeGroupedResourceMetricsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useSSEConnection } from "@/domain/system-monitoring/hooks/use-sse-connection.hook";
import type { WorkspaceMetricType } from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import {
  getMetricsNameParam,
  WORKSPACE_METRIC_TYPE,
  WORKSPACE_SSE_EVENT_NAME,
} from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import { useWorkspaceMetricBuffer } from "@/domain/user-monitoring/hooks/use-workspace-metric-buffers.hook";
import { extractWorkspaceMetric } from "@/domain/user-monitoring/utils/workspace-metric-mapper.util";
import { SSE_BASE_URL, SSE_ENDPOINTS } from "@/shared/constants/sse.constant";
import type { ChartDataSeries } from "@/shared/utils/chart.util";

function mergeGpuSeries(
  prevData: ChartDataSeries[],
  newData: ChartDataSeries[],
  bufferSize: number,
): ChartDataSeries[] {
  const seriesByName = new Map<string, Map<number, { x: Date; y: number }>>();

  const ensureSeriesMap = (name: string) => {
    const existingSeries = seriesByName.get(name);
    if (existingSeries) {
      return existingSeries;
    }

    const newSeries = new Map<number, { x: Date; y: number }>();
    seriesByName.set(name, newSeries);
    return newSeries;
  };

  newData.forEach((series) => {
    const pointsMap = ensureSeriesMap(series.name);
    series.data.forEach((point) => {
      pointsMap.set(point.x.getTime(), point);
    });
  });

  prevData.forEach((series) => {
    const pointsMap = ensureSeriesMap(series.name);
    series.data.forEach((point) => {
      const timestamp = point.x.getTime();
      if (!pointsMap.has(timestamp)) {
        pointsMap.set(timestamp, point);
      }
    });
  });

  return Array.from(seriesByName.entries()).map(([name, pointsMap]) => {
    const sortedPoints = Array.from(pointsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, point]) => point);

    const trimmedPoints =
      sortedPoints.length > bufferSize
        ? sortedPoints.slice(-bufferSize)
        : sortedPoints;

    return {
      type: "area" as const,
      name,
      data: trimmedPoints,
    };
  });
}

interface UseWorkspaceMetricsStreamParams {
  workspaceId: number | undefined;
  metricType: WorkspaceMetricType;
  lastHistoryTimestamp: string | null;
  initialData?: ChartDataSeries[];
  enabled?: boolean;
  bufferSize?: number;
}

interface UseWorkspaceMetricsStreamReturn {
  data: ChartDataSeries[];
  isConnected: boolean;
  isError: boolean;
  error: string | null;
}

export function useWorkspaceMetricsStream({
  workspaceId,
  metricType,
  lastHistoryTimestamp,
  initialData,
  enabled = true,
  bufferSize,
}: UseWorkspaceMetricsStreamParams): UseWorkspaceMetricsStreamReturn {
  const buffer = useWorkspaceMetricBuffer({ bufferSize });
  const [gpuData, setGpuData] = useState<ChartDataSeries[]>([]);

  const [initialTimestamp, setInitialTimestamp] = useState<string | null>(null);
  const prevMetricTypeRef = useRef<WorkspaceMetricType>(metricType);
  const prevWorkspaceIdRef = useRef<number | undefined>(workspaceId);

  const metricsName = getMetricsNameParam(metricType);

  useEffect(() => {
    const workspaceChanged = prevWorkspaceIdRef.current !== workspaceId;
    const metricChanged = prevMetricTypeRef.current !== metricType;

    if (workspaceChanged || metricChanged) {
      setInitialTimestamp(lastHistoryTimestamp);
      prevMetricTypeRef.current = metricType;
      prevWorkspaceIdRef.current = workspaceId;
      return;
    }

    if (initialTimestamp !== null) return;
    if (!lastHistoryTimestamp) return;

    setInitialTimestamp(lastHistoryTimestamp);
  }, [metricType, workspaceId, lastHistoryTimestamp, initialTimestamp]);

  const sseUrl = useMemo(() => {
    if (!workspaceId || !enabled || !SSE_BASE_URL) {
      return "";
    }

    const effectiveLastSentTime = initialTimestamp ?? new Date().toISOString();

    const url = new URL(
      SSE_ENDPOINTS.workspaceMetrics(workspaceId),
      SSE_BASE_URL,
    );

    url.searchParams.set("metricsName", metricsName);
    url.searchParams.set("lastSentTime", effectiveLastSentTime);

    return url.toString();
  }, [workspaceId, enabled, metricsName, initialTimestamp]);

  useEffect(() => {
    if (enabled && initialData) {
      if (metricType === WORKSPACE_METRIC_TYPE.GPU) {
        setGpuData(initialData);
      } else {
        buffer.initFromData(initialData);
      }
    }
  }, [enabled, initialData, metricType, buffer.initFromData]);

  useEffect(() => {
    if (!enabled) {
      buffer.resetBuffer();
      setGpuData([]);
    }
  }, [enabled, buffer.resetBuffer]);

  const handleMessage = useCallback(
    (data: TimeGroupedResourceMetricsResponse[]) => {
      try {
        const extraction = extractWorkspaceMetric(data, metricType);

        if (extraction.status !== "success") return;
        if (extraction.data.length === 0) return;
        if (metricType === WORKSPACE_METRIC_TYPE.GPU) {
          setGpuData((prevData) =>
            mergeGpuSeries(prevData, extraction.data, bufferSize ?? 5000),
          );
        } else {
          buffer.updateBuffer(extraction.data);
        }
      } catch (error) {
        console.error("[SSE] Failed to process event:", error);
      }
    },
    [metricType, bufferSize, buffer.updateBuffer],
  );

  const sse = useSSEConnection<TimeGroupedResourceMetricsResponse[]>({
    url: sseUrl,
    eventName: WORKSPACE_SSE_EVENT_NAME,
    enabled: enabled && !!sseUrl,
    onMessage: handleMessage,
  });

  const chartData =
    metricType === WORKSPACE_METRIC_TYPE.GPU ? gpuData : buffer.toChartSeries();

  return {
    data: chartData,
    isConnected: sse.isConnected,
    isError: sse.isError,
    error: sse.error,
  };
}
