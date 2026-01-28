"use client";

import { useEffect } from "react";

import { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDateRangeMode } from "@/domain/system-monitoring/hooks/use-date-range-mode.hook";
import { useWorkloadIdentifier } from "@/domain/workload/hooks/use-workload-identifier.hook";
import { useWorkloadMetrics } from "@/domain/workload/hooks/use-workload-metrics.hook";
import { useWorkloadMetricsStream } from "@/domain/workload/hooks/use-workload-metrics-stream.hook";
import { useWorkloadStatusPolling } from "@/domain/workload/hooks/use-workload-status-polling";
import type {
  WorkloadMetricSeriesGroup,
  WorkloadMetricsErrors,
} from "@/domain/workload/types/workload-metrics.type";

interface UseWorkloadMonitoringDataReturn {
  data: WorkloadMetricSeriesGroup;
  isLoading: boolean;
  errors: WorkloadMetricsErrors;
  dateState: ReturnType<typeof useDateRangeMode>;
  isValid: boolean;
  workloadResourceName: string;
  isTerminated: boolean;
}

export function useWorkloadMonitoringData(): UseWorkloadMonitoringDataReturn {
  const { workloadResourceName, workspaceId, isValid } =
    useWorkloadIdentifier();
  const dateState = useDateRangeMode();
  const { isLiveMode, setHistoryMode } = dateState;

  const { status } = useWorkloadStatusPolling({
    workspaceId: workspaceId ?? 0,
    workloadResourceName,
    enabled: isValid,
  });

  const isTerminated =
    status === WorkloadStatusResponseWorkloadStatus.TERMINATED;

  useEffect(() => {
    if (isTerminated && isLiveMode) {
      setHistoryMode();
    }
  }, [isLiveMode, setHistoryMode, isTerminated]);

  const metricsQuery = useWorkloadMetrics({
    workspaceId,
    workloadResourceName,
    dateRange: dateState.apiDateRange,
    enabled: isValid && dateState.isApiReady,
  });

  const metricsStream = useWorkloadMetricsStream({
    workspaceId,
    workloadResourceName,
    lastHistoryTimestamp: metricsQuery.lastTimestamp,
    initialData: metricsQuery.data,
    enabled:
      isValid &&
      dateState.isLiveMode &&
      dateState.isApiReady &&
      !isTerminated &&
      !metricsQuery.isLoading &&
      metricsQuery.lastTimestamp !== null,
  });

  const data =
    dateState.isLiveMode && !isTerminated
      ? metricsStream.data
      : metricsQuery.data;
  const isLoading = metricsQuery.isLoading;
  const errors =
    dateState.isLiveMode && !isTerminated
      ? metricsStream.errors
      : metricsQuery.errors;

  return {
    data,
    isLoading,
    errors,
    dateState,
    workloadResourceName,
    isValid,
    isTerminated,
  };
}
