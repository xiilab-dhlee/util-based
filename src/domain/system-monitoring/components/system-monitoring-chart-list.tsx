"use client";

import styled from "styled-components";

import type { GpuTimeseriesData } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GpuMetricCard } from "@/domain/system-monitoring/components/gpu-metric-card";
import { SystemMetricCard } from "@/domain/system-monitoring/components/system-metric-card";
import type {
  AllGpuMetricsData,
  AllGpuMetricsErrors,
  AllSystemMetricsErrors,
  SystemMetricSeriesGroup,
} from "@/domain/system-monitoring/types/metrics.type";
import type { SystemMonitoringTabKey } from "@/domain/system-monitoring/types/system-monitoring.type";

export interface SystemMonitoringChartListProps {
  activeTab: SystemMonitoringTabKey;
  gpuData: AllGpuMetricsData;
  systemData: SystemMetricSeriesGroup;
  gpuIsLoading: boolean;
  systemIsLoading: boolean;
  gpuErrors: AllGpuMetricsErrors;
  systemErrors: AllSystemMetricsErrors;
  selectedGpuIndices: string[];
  seriesVisibilityMap: Record<string, Record<string, boolean>>;
  onSeriesToggle: (
    metricType: string,
    seriesName: string,
    isActive: boolean,
  ) => void;
  onChangeRangeFromChart?: (range: { start: Date; end: Date }) => void;
}

export function SystemMonitoringChartList({
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
}: SystemMonitoringChartListProps) {
  const selectedSet = new Set(selectedGpuIndices);

  const filterByGpuIndices = (data: GpuTimeseriesData[]) => {
    if (selectedGpuIndices.length === 0) {
      return data;
    }
    return data.filter((gpu) => selectedSet.has(gpu.gpuIndex));
  };

  const showGpuCharts = activeTab === "gpu";
  const showSystemCharts = activeTab === "system";

  return (
    <ChartArticle>
      {showGpuCharts && (
        <>
          <ChartSingleRow>
            <GpuMetricCard
              type="gpu-utilization"
              data={filterByGpuIndices(gpuData.utilization)}
              isLoading={gpuIsLoading}
              isError={gpuErrors.utilization}
              seriesVisibility={seriesVisibilityMap["gpu-utilization"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("gpu-utilization", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartSingleRow>

          <ChartMultiRow>
            <GpuMetricCard
              type="gpu-memory"
              data={filterByGpuIndices(gpuData.memory)}
              isLoading={gpuIsLoading}
              isError={gpuErrors.memory}
              seriesVisibility={seriesVisibilityMap["gpu-memory"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("gpu-memory", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
            <GpuMetricCard
              type="gpu-power-usage"
              data={filterByGpuIndices(gpuData.powerUsage)}
              isLoading={gpuIsLoading}
              isError={gpuErrors.powerUsage}
              seriesVisibility={seriesVisibilityMap["gpu-power-usage"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("gpu-power-usage", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartMultiRow>

          <ChartSingleRow>
            <GpuMetricCard
              type="gpu-temperature"
              data={filterByGpuIndices(gpuData.temperature)}
              isLoading={gpuIsLoading}
              isError={gpuErrors.temperature}
              seriesVisibility={seriesVisibilityMap["gpu-temperature"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("gpu-temperature", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartSingleRow>
        </>
      )}

      {showSystemCharts && (
        <>
          <ChartSingleRow>
            <SystemMetricCard
              type="cpu-utilization"
              seriesData={systemData.cpuUtilization}
              isLoading={systemIsLoading}
              isError={systemErrors.cpuUtilization}
              seriesVisibility={seriesVisibilityMap["cpu-utilization"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("cpu-utilization", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartSingleRow>

          <ChartMultiRow>
            <SystemMetricCard
              type="cpu-temperature"
              seriesData={systemData.cpuTemperature}
              isLoading={systemIsLoading}
              isError={systemErrors.cpuTemperature}
              seriesVisibility={seriesVisibilityMap["cpu-temperature"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("cpu-temperature", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
            <SystemMetricCard
              type="memory-utilization"
              seriesData={systemData.memoryUtilization}
              isLoading={systemIsLoading}
              isError={systemErrors.memoryUtilization}
              seriesVisibility={seriesVisibilityMap["memory-utilization"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("memory-utilization", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartMultiRow>

          <ChartMultiRow>
            <SystemMetricCard
              type="disk-utilization"
              seriesData={systemData.diskUtilization}
              isLoading={systemIsLoading}
              isError={systemErrors.diskUtilization}
              seriesVisibility={seriesVisibilityMap["disk-utilization"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("disk-utilization", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
            <SystemMetricCard
              type="disk-rw"
              seriesData={systemData.diskRw}
              isLoading={systemIsLoading}
              isError={systemErrors.diskRw}
              seriesVisibility={seriesVisibilityMap["disk-rw"]}
              onSeriesToggle={(name, isActive) =>
                onSeriesToggle("disk-rw", name, isActive)
              }
              onSelectRange={onChangeRangeFromChart}
            />
          </ChartMultiRow>
        </>
      )}
    </ChartArticle>
  );
}

const ChartSingleRow = styled.div`
  height: 390px;
  margin-bottom: 10px;
`;

const ChartMultiRow = styled.div`
  height: 390px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

const ChartArticle = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;
