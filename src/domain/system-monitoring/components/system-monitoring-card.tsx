"use client";

import { useRef } from "react";

import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import { useResourceMetricsWithMode } from "@/domain/system-monitoring/hooks/use-system-monitoring.hook";
import { mapSystemResourceMetricsToChartData } from "@/domain/system-monitoring/utils/system-monitoring-chart.util";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { GpuUtilizationTooltipTitle } from "@/shared/components/tooltip-title/gpu-utilization-tooltip-title";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";

interface SystemMonitoringCardProps {
  /** 모니터링할 메트릭 타입 (CPU, 메모리, GPU 등) */
  type: MonitoringMetricType;
  /** 선택된 노드명 */
  nodeName: string;
  /** 현재 날짜 모드: live | history */
  mode: MonitoringDateMode;
  /** history 모드에서 사용할 날짜 범위 */
  dateRange: { start: Date; end: Date };
  /**
   * GPU 필터 (GPU 메트릭만 사용)
   * - 백엔드로 전달할 GPU 이름 배열
   */
  selectedGpu?: string[];
  /** 차트 타입 (기본값: area) */
  chartType?: "line" | "bar" | "area";
  /**
   * 차트에서 드래그로 선택된 구간을 상위로 전달하는 콜백
   */
  onSelectRange?: (range: { start: Date; end: Date }) => void;
}

/**
 * 워크로드의 특정 메트릭(CPU, 메모리, GPU 등)을 실시간으로 모니터링하는 카드 컴포넌트
 */
export function SystemMonitoringCard({
  type,
  nodeName,
  mode,
  dateRange,
  selectedGpu,
  chartType = "line",
  onSelectRange,
}: SystemMonitoringCardProps) {
  // ApexCharts 인스턴스에 대한 ref
  const chartRef = useRef<{
    showSeries?: (name: string) => void;
    hideSeries?: (name: string) => void;
  } | null>(null);

  // 메트릭 정보 가져오기
  const metricInfo = getMetricInfo(type);

  const shouldShowGpuUtilizationTooltip = type === "gpu-utilization";

  const { data, isLoading, error } = useResourceMetricsWithMode({
    mode,
    nodeName,
    metricName: type,
    historyRange: dateRange,
    gpuName: selectedGpu,
  });

  // 차트 데이터 변환
  const chartData = mapSystemResourceMetricsToChartData(
    type,
    data?.data ?? [],
    chartType,
  );

  const hasData = chartData.length > 0;

  const handleChartReady = (chart: unknown) => {
    chartRef.current = chart as {
      showSeries?: (name: string) => void;
      hideSeries?: (name: string) => void;
    };
  };

  const handleToggleSeries = (seriesName: string, isActive: boolean) => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    if (isActive) {
      chart.showSeries?.(seriesName);
    } else {
      chart.hideSeries?.(seriesName);
    }
  };

  return (
    <LikeCompactCardContainer>
      <LikeCompactCardHeader>
        <LikeCompactCardTitle className="truncate">
          {metricInfo.text}
          {shouldShowGpuUtilizationTooltip && (
            <GuideTooltip title={<GpuUtilizationTooltipTitle />} />
          )}
        </LikeCompactCardTitle>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        <MonitoringChart
          onSelectRange={onSelectRange}
          onChartReady={handleChartReady}
          height={290}
          series={chartData}
          unit={metricInfo.unit}
          colors={metricInfo.colors}
          isLoading={isLoading}
          isError={!!error}
          chartType={chartType}
        />
        {!isLoading && !error && hasData && (
          <ChartLegendToggle
            key={`${nodeName}-${type}`}
            series={chartData}
            colors={metricInfo.colors}
            onToggle={handleToggleSeries}
          />
        )}
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}
