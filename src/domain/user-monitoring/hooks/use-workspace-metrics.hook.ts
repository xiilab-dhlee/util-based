import { useMemo } from "react";

import { useGetResourceMetricsTimeseries } from "@/api/generated/workspace-metrics/workspace-metrics";
import type { WorkspaceMetricType } from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import {
  DEFAULT_STEP,
  getMetricsNameParam,
  INITIAL_HISTORY_WINDOW_MS,
} from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import {
  extractWorkspaceMetric,
  getLastTimestamp,
} from "@/domain/user-monitoring/utils/workspace-metric-mapper.util";
import type { ChartDataSeries } from "@/shared/utils/chart.util";
import { formatDateForRequest } from "@/shared/utils/date.util";

interface UseWorkspaceMetricsParams {
  workspaceId: number | undefined;
  metricType: WorkspaceMetricType;
  enabled?: boolean;
}

interface UseWorkspaceMetricsReturn {
  data: ChartDataSeries[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastTimestamp: string | null;
}

/**
 * Fetch 10-minute historical workspace metrics
 * - Always fetches last 10 minutes (fixed window)
 * - Single metric per call (CPU OR MEM, not both)
 * - Returns last timestamp for SSE handoff
 * - Data is already converted (string→number, bytes→GB) by mapper
 *
 * @param params - Hook parameters
 * @param params.workspaceId - Workspace ID from selectedWorkspace atom
 * @param params.metricType - Metric type ('CPU' | 'MEM')
 * @param params.enabled - Whether to enable the query
 * @returns History metrics data and state
 */
export function useWorkspaceMetrics({
  workspaceId,
  metricType,
  enabled = true,
}: UseWorkspaceMetricsParams): UseWorkspaceMetricsReturn {
  // Calculate 10-minute window (fresh time window on each render)
  const now = new Date();
  const start = new Date(now.getTime() - INITIAL_HISTORY_WINDOW_MS);
  const startDate = formatDateForRequest(start);
  const endDate = formatDateForRequest(now);

  // Fetch history data
  const query = useGetResourceMetricsTimeseries(
    workspaceId ?? 0,
    {
      metricsName: getMetricsNameParam(metricType),
      startDate,
      endDate,
      step: DEFAULT_STEP,
    },
    {
      query: {
        enabled: enabled && Boolean(workspaceId),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0, // Always fetch fresh data when metricType changes
      },
    },
  );

  // Extract and transform data (all conversions done in mapper)
  const result = useMemo(() => {
    const extraction = extractWorkspaceMetric(query.data, metricType);

    return {
      data: extraction.data, // ✅ ChartDataSeries[] (already converted)
      error: extraction.error || null,
      lastTimestamp: getLastTimestamp(extraction.data),
    };
  }, [query.data, metricType]);

  return {
    data: result.data,
    isLoading: query.isLoading,
    isError: query.isError || result.error !== null,
    error: result.error,
    lastTimestamp: result.lastTimestamp,
  };
}
