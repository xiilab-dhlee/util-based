"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { WorkloadCreationSeries } from "@/domain/report/schemas/report.schema";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import {
  WORKLOAD_JOB_TYPE_COLOR_MAP,
  WORKLOAD_JOB_TYPE_LABEL_MAP,
} from "@/shared/constants/workload.constant";

interface WorkloadCreationChartProps {
  data: WorkloadCreationSeries[];
}

/**
 * 워크로드 생성 정보 차트 컴포넌트
 * Job Type별 시간에 따른 워크로드 생성 비율 추이를 보여주는 꺾은선 그래프
 */
export function WorkloadCreationChart({ data }: WorkloadCreationChartProps) {
  const [chartInstance, setChartInstance] = useState<ApexCharts | null>(null);

  // ApexCharts 시리즈 데이터 변환
  const series: ApexOptions["series"] = useMemo(
    () =>
      data.map((item) => ({
        name: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
        data: item.data.map((point) => ({
          x: new Date(point.x).getTime(),
          y: point.y,
        })),
      })),
    [data],
  );

  // 색상 배열
  const colors = useMemo(
    () => [
      WORKLOAD_JOB_TYPE_COLOR_MAP.BATCH,
      WORKLOAD_JOB_TYPE_COLOR_MAP.INTERACTIVE,
      WORKLOAD_JOB_TYPE_COLOR_MAP.DISTRIBUTED,
    ],
    [],
  );

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
      data.map((item) => ({
        type: "line" as const,
        name: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
        data: item.data.map((point) => ({
          x: new Date(point.x),
          y: point.y,
        })),
      })),
    [data],
  );

  // 각 시리즈별 최소/최대값 계산
  const customOptions: ApexOptions = useMemo(() => {
    if (!data || data.length === 0) return {};

    const annotations: ApexOptions["annotations"] = {
      points: [],
    };

    data.forEach((item, seriesIndex) => {
      const values = item.data.map((d) => d.y);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      const minDataPoint = item.data.find((d) => d.y === minValue);
      const maxDataPoint = item.data.find((d) => d.y === maxValue);

      const color = colors[seriesIndex % colors.length];

      // 최소값 포인트 annotation
      if (minDataPoint) {
        annotations.points?.push({
          x: new Date(minDataPoint.x).getTime(),
          y: minValue,
          seriesIndex,
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

      // 최대값 포인트 annotation
      if (maxDataPoint) {
        annotations.points?.push({
          x: new Date(maxDataPoint.x).getTime(),
          y: maxValue,
          seriesIndex,
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
  }, [data, colors]);

  return (
    <Card hoverable={false} contentVariant="compact" title="워크로드 생성 정보">
      <ChartWrapper>
        <MonitoringChart
          series={series}
          height={320}
          unit="%"
          colors={colors}
          chartType="line"
          chartId="workload-creation-chart"
          onChartReady={handleChartReady}
          customOptions={customOptions}
        />
        <ChartLegendToggle
          series={legendSeries}
          colors={colors}
          onToggle={handleLegendToggle}
        />
      </ChartWrapper>
    </Card>
  );
}

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
