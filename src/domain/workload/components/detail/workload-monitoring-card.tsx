"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { WorkloadMetricSeries } from "@/domain/workload/types/workload-metrics.type";
import {
  getWorkloadMetricInfo,
  type WorkloadMonitoringMetricType,
} from "@/domain/workload/utils/workload-monitoring.util";
import { mapWorkloadMetricSeriesToChartData } from "@/domain/workload/utils/workload-monitoring-chart.util";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadMonitoringCardProps {
  type: WorkloadMonitoringMetricType;
  data?: WorkloadMetricSeries;
  seriesVisibilityMap?: Record<string, Record<string, boolean>>;
  onSeriesToggle?: (
    metricType: string,
    seriesName: string,
    isActive: boolean,
  ) => void;
  isLoading?: boolean;
  hasError?: boolean;
  onChangeRange?: (range: { start: Date; end: Date }) => void;
}

export function WorkloadMonitoringCard({
  type,
  data,
  seriesVisibilityMap = {},
  onSeriesToggle,
  isLoading = false,
  hasError = false,
  onChangeRange,
}: WorkloadMonitoringCardProps) {
  const publish = usePublish();
  const metricInfo = getWorkloadMetricInfo(type);

  // WorkloadMetricSeries → ApexCharts 데이터 변환
  const chartData = useMemo(() => {
    if (!data) return [];
    return mapWorkloadMetricSeriesToChartData(data, type, "line");
  }, [data, type]);

  // Legend 필터링 적용
  const filteredChartData = useMemo(() => {
    const visibility = seriesVisibilityMap[type];
    if (!visibility) return chartData;
    return chartData.filter((series) => visibility[series.name] !== false);
  }, [chartData, seriesVisibilityMap, type]);

  // Legend 활성 상태 맵
  const activeSeriesMap = useMemo(() => {
    const visibility = seriesVisibilityMap[type] || {};
    const map: Record<string, boolean> = {};
    for (const series of chartData) {
      map[series.name] = visibility[series.name] !== false;
    }
    return map;
  }, [chartData, seriesVisibilityMap, type]);

  const hasData = chartData.length > 0;

  const handleClickIcon = () => {
    publish(WORKLOAD_EVENTS.sendWorkloadMonitoring, {
      title: metricInfo.text,
      series: filteredChartData,
      unit: metricInfo.unit,
      colors: metricInfo.colors,
    });
  };

  return (
    <LikeCompactCardContainer
      data-testid={WORKLOAD_SELECTOR.monitoringChart(type)}
    >
      <LikeCompactCardHeader>
        <LikeCompactCardTitle
          className="truncate"
          data-testid={WORKLOAD_SELECTOR.MONITORING_CHART_TITLE}
        >
          {metricInfo.text}
        </LikeCompactCardTitle>
        <IconButton
          type="button"
          onClick={handleClickIcon}
          data-testid={WORKLOAD_SELECTOR.MONITORING_CHART_EXPAND_BUTTON}
        >
          <Icon name="Size02" color="var(--icon-fill)" size={16} />
          <span className="sr-only">모니터링 차트 확대</span>
        </IconButton>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        <MonitoringChart
          onSelectRange={onChangeRange}
          height={290}
          series={filteredChartData}
          unit={metricInfo.unit}
          colors={metricInfo.colors}
          isLoading={isLoading}
          isError={hasError}
          chartType="line"
        />
        {!isLoading && !hasError && hasData && (
          <ChartLegendToggle
            series={chartData}
            colors={metricInfo.colors}
            activeSeriesMap={activeSeriesMap}
            onToggle={(name, isActive) => {
              if (onSeriesToggle) {
                onSeriesToggle(type, name, isActive);
              }
            }}
          />
        )}
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
