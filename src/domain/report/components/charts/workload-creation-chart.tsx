"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import { useChartInstance } from "@/domain/report/hooks/use-chart-instance";
import type { WorkloadCreationSeries } from "@/domain/report/schemas/report.schema";
import {
  convertToApexSeries,
  convertToLegendSeries,
  createMinMaxAnnotations,
} from "@/domain/report/utils/chart";
import {
  WORKLOAD_JOB_TYPE_COLOR_MAP,
  WORKLOAD_JOB_TYPE_LABEL_MAP,
} from "@/domain/workload/constants/workload.constant";
import { ChartLegendToggle } from "@/shared/components/chart/chart-legend-toggle";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";

interface WorkloadCreationChartProps {
  data: WorkloadCreationSeries[];
}

/**
 * 워크로드 생성 정보 차트 컴포넌트
 * Job Type별 시간에 따른 워크로드 생성 비율 추이를 보여주는 꺾은선 그래프
 */
export function WorkloadCreationChart({ data }: WorkloadCreationChartProps) {
  const { handleChartReady, handleLegendToggle } = useChartInstance();

  // ApexCharts 시리즈 데이터 변환
  const series = useMemo<ApexOptions["series"]>(
    () => convertToApexSeries(data, WORKLOAD_JOB_TYPE_LABEL_MAP),
    [data],
  );

  // ChartLegendToggle용 시리즈 변환
  const legendSeries = useMemo(
    () => convertToLegendSeries(data, WORKLOAD_JOB_TYPE_LABEL_MAP, "line"),
    [data],
  );

  // 데이터 순서에 맞는 색상 배열 생성 (type 기반 매핑)
  const colors = useMemo(() => {
    return data.map((item) => WORKLOAD_JOB_TYPE_COLOR_MAP[item.type]);
  }, [data]);

  // Min/Max annotation용 시리즈 데이터 변환
  const seriesData = useMemo(() => {
    return data.map((item) => ({
      name: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
      data: item.data,
    }));
  }, [data]);

  // Min/Max annotation 생성
  const customOptions = useMemo<ApexOptions>(() => {
    if (!seriesData || seriesData.length === 0) return {};

    const annotations = createMinMaxAnnotations(seriesData, colors, {
      unit: "%",
    });

    return { annotations };
  }, [seriesData, colors]);

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
