"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { GPU_CHART_COLORS } from "@/domain/monitoring/utils/monitoring.util";
import type { GpuSeries } from "@/domain/report/schemas/report.schema";
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
  const series: ApexOptions["series"] = data || [];
  const [chartInstance, setChartInstance] = useState<ApexCharts | null>(null);

  const handleChartReady = (chart: unknown) => {
    setChartInstance(chart as ApexCharts);
  };

  const handleLegendToggle = (seriesName: string, isActive: boolean) => {
    if (!chartInstance) return;

    if (isActive) {
      chartInstance.showSeries(seriesName);
    } else {
      chartInstance.hideSeries(seriesName);
    }
  };

  // ChartLegendToggle용 타입 변환
  const legendSeries = useMemo(
    () =>
      (data || []).map((s) => ({
        type: "line" as const,
        name: s.name,
        data: s.data.map((d) => ({
          x: new Date(d.x),
          y: d.y,
        })),
      })),
    [data],
  );

  // GPU별 최솟값, 최댓값 계산 및 annotations 생성
  const customOptions: ApexOptions = useMemo(() => {
    if (!data || data.length === 0) return {};

    const annotations: ApexOptions["annotations"] = {
      points: [],
    };

    data.forEach((gpuSeries, index) => {
      const values = gpuSeries.data.map((d) => d.y);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      const minDataPoint = gpuSeries.data.find((d) => d.y === minValue);
      const maxDataPoint = gpuSeries.data.find((d) => d.y === maxValue);

      const color = GPU_CHART_COLORS[index % GPU_CHART_COLORS.length];

      // 최솟값 포인트 annotation (seriesIndex 연결)
      if (minDataPoint) {
        annotations.points?.push({
          x: new Date(minDataPoint.x).getTime(),
          y: minValue,
          seriesIndex: index, // 시리즈 인덱스 연결
          marker: {
            size: 6,
            fillColor: color,
            strokeColor: "#fff",
            strokeWidth: 2,
          },
          label: {
            text: `최소 ${minValue}%`,
            style: {
              color: "#fff",
              background: color,
              fontSize: "10px",
              padding: {
                left: 4,
                right: 4,
                top: 2,
                bottom: 2,
              },
            },
            offsetY: -10,
          },
        });
      }

      // 최댓값 포인트 annotation (seriesIndex 연결)
      if (maxDataPoint) {
        annotations.points?.push({
          x: new Date(maxDataPoint.x).getTime(),
          y: maxValue,
          seriesIndex: index, // 시리즈 인덱스 연결
          marker: {
            size: 6,
            fillColor: color,
            strokeColor: "#fff",
            strokeWidth: 2,
          },
          label: {
            text: `최대 ${maxValue}%`,
            style: {
              color: "#fff",
              background: color,
              fontSize: "10px",
              padding: {
                left: 4,
                right: 4,
                top: 2,
                bottom: 2,
              },
            },
            offsetY: -10,
          },
        });
      }
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
