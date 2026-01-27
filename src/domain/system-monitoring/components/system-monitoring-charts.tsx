"use client";

import {
  SystemMonitoringChartList,
  type SystemMonitoringChartListProps,
} from "@/domain/system-monitoring/components/system-monitoring-chart-list";

type SystemMonitoringChartsProps = SystemMonitoringChartListProps;

export function SystemMonitoringCharts({
  activeTab,
  gpuData,
  systemData,
  gpuIsLoading,
  systemIsLoading,
  gpuErrors,
  systemErrors,
  selectedGpuIndices,
  seriesVisibilityMap,
  onSeriesToggle,
  onChangeRangeFromChart,
}: SystemMonitoringChartsProps) {
  return (
    <SystemMonitoringChartList
      activeTab={activeTab}
      gpuData={gpuData}
      systemData={systemData}
      gpuIsLoading={gpuIsLoading}
      systemIsLoading={systemIsLoading}
      gpuErrors={gpuErrors}
      systemErrors={systemErrors}
      selectedGpuIndices={selectedGpuIndices}
      seriesVisibilityMap={seriesVisibilityMap}
      onSeriesToggle={onSeriesToggle}
      onChangeRangeFromChart={onChangeRangeFromChart}
    />
  );
}
