"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import styled from "styled-components";

import { GPU_CHART_COLORS } from "@/domain/monitoring/utils/monitoring.util";
import { useChartInstance } from "@/domain/report/hooks/use-chart-instance";
import type { GpuSeries } from "@/domain/report/schemas/report.schema";
import {
  convertToLegendSeries,
  createMinMaxAnnotations,
  normalizeNamedSeries,
} from "@/domain/report/utils/chart";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";

interface NodeGpuChartProps {
  nodeName: string;
  data?: GpuSeries[];
}

/**
 * 노드 GPU 사용률 추이 차트
 */
export function NodeGpuChart({ nodeName, data }: NodeGpuChartProps) {
  const { handleChartReady, handleLegendToggle } = useChartInstance();

  // ApexCharts 시리즈 데이터 (이미 ApexCharts 형식)
  const series: ApexOptions["series"] = data || [];

  // ChartLegendToggle용 시리즈 변환
  const legendSeries = useMemo(() => {
    if (!data) return [];
    const normalized = normalizeNamedSeries(data);
    return convertToLegendSeries(normalized, undefined, "line");
  }, [data]);

  // Min/Max annotation 생성
  const customOptions = useMemo<ApexOptions>(() => {
    if (!data || data.length === 0) return {};

    const annotations = createMinMaxAnnotations(data, GPU_CHART_COLORS, {
      unit: "%",
    });

    return { annotations };
  }, [data]);

  return (
    <Container>
      <MonitoringChart
        series={series}
        height={300}
        unit="%"
        colors={GPU_CHART_COLORS}
        chartType="line"
        chartId={`${nodeName}-gpu-chart`}
        onChartReady={handleChartReady}
        customOptions={customOptions}
      />
      <ChartLegendToggle
        series={legendSeries}
        colors={GPU_CHART_COLORS}
        onToggle={handleLegendToggle}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
