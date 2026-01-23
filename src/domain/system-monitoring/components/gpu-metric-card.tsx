"use client";

import { useMemo } from "react";

import type { GpuTimeseriesData } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import { mapGpuMetricsToChartData } from "@/domain/system-monitoring/utils/system-monitoring-chart.util";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { GpuUtilizationTooltipTitle } from "@/shared/components/tooltip-title/gpu-utilization-tooltip-title";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";

interface GpuMetricCardProps {
  type: MonitoringMetricType;
  data: GpuTimeseriesData[];
  isLoading: boolean;
  isError: boolean;
  chartType?: "line" | "bar" | "area";
  seriesVisibility?: Record<string, boolean>;
  onSeriesToggle?: (seriesName: string, isActive: boolean) => void;
  onSelectRange?: (range: { start: Date; end: Date }) => void;
}

export function GpuMetricCard({
  type,
  data,
  isLoading,
  isError,
  chartType = "line",
  seriesVisibility,
  onSeriesToggle,
  onSelectRange,
}: GpuMetricCardProps) {
  const metricInfo = getMetricInfo(type);

  const chartData = useMemo(
    () => mapGpuMetricsToChartData(data, type, chartType),
    [data, type, chartType],
  );

  const filteredChartData = useMemo(() => {
    if (!seriesVisibility) return chartData;
    return chartData.filter(
      (series) => seriesVisibility[series.name] !== false,
    );
  }, [chartData, seriesVisibility]);

  const activeSeriesMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const series of chartData) {
      map[series.name] = seriesVisibility?.[series.name] !== false;
    }
    return map;
  }, [chartData, seriesVisibility]);

  const hasData = chartData.length > 0;
  const shouldShowTooltip = type === "gpu-utilization";

  return (
    <LikeCompactCardContainer>
      <LikeCompactCardHeader>
        <LikeCompactCardTitle className="truncate">
          {metricInfo.text}
          {shouldShowTooltip && (
            <GuideTooltip title={<GpuUtilizationTooltipTitle />} />
          )}
        </LikeCompactCardTitle>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        <MonitoringChart
          onSelectRange={onSelectRange}
          height={290}
          series={filteredChartData}
          unit={metricInfo.unit}
          colors={metricInfo.colors}
          isLoading={isLoading}
          isError={isError}
          chartType={chartType}
        />
        {!isLoading && !isError && hasData && (
          <ChartLegendToggle
            series={chartData}
            colors={metricInfo.colors}
            activeSeriesMap={activeSeriesMap}
            onToggle={onSeriesToggle}
          />
        )}
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}
