"use client";

import { useMemo } from "react";

import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import type { SystemMetricSeries } from "@/domain/system-monitoring/types/metrics.type";
import { mapSystemMetricsSeriesToChartData } from "@/domain/system-monitoring/utils/system-monitoring-chart.util";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";

interface SystemMetricCardProps {
  type: MonitoringMetricType;
  seriesData: SystemMetricSeries | SystemMetricSeries[];
  isLoading: boolean;
  isError: boolean;
  chartType?: "line" | "bar" | "area";
  seriesVisibility?: Record<string, boolean>;
  onSeriesToggle?: (seriesName: string, isActive: boolean) => void;
  onSelectRange?: (range: { start: Date; end: Date }) => void;
}

export function SystemMetricCard({
  type,
  seriesData,
  isLoading,
  isError,
  chartType = "line",
  seriesVisibility,
  onSeriesToggle,
  onSelectRange,
}: SystemMetricCardProps) {
  const metricInfo = getMetricInfo(type);

  const normalizedSeriesData = useMemo(() => {
    return Array.isArray(seriesData) ? seriesData : [seriesData];
  }, [seriesData]);

  const chartData = useMemo(
    () =>
      mapSystemMetricsSeriesToChartData(normalizedSeriesData, type, chartType),
    [normalizedSeriesData, type, chartType],
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

  return (
    <LikeCompactCardContainer>
      <LikeCompactCardHeader>
        <LikeCompactCardTitle className="truncate">
          {metricInfo.text}
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
