import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import styled from "styled-components";

// 동적 import로 ApexCharts 로드 (SSR 비활성화)
const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DashboardResourceRecoveryChartProps {
  series: number; // 단위별 비율
}

const CHART_OPTIONS: ApexOptions = {
  chart: {
    type: "radialBar",
    offsetY: 1,
    offsetX: -1,
  },
  plotOptions: {
    radialBar: {
      startAngle: -180, // 6시 방향 시작
      endAngle: 180, // 6시 방향 끝 (전체 원)
      hollow: {
        size: "80%", // 중앙 빈 공간 크기
      },
      track: {
        background: "#22242C",
        strokeWidth: "97%",
        margin: 5,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      gradientToColors: ["#8B59FF"],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  colors: ["#CCB7FF"],
};

export function DashboardResourceRecoveryChart({
  series,
}: DashboardResourceRecoveryChartProps) {
  // series만 동적으로 업데이트
  const chartSeries = useMemo(() => [series], [series]);

  return (
    <ChartWrapper>
      <DynamicApexChart
        options={CHART_OPTIONS}
        series={chartSeries}
        type="radialBar"
        height={280}
      />
    </ChartWrapper>
  );
}

const ChartWrapper = styled.div`
  width: 100%;
`;
