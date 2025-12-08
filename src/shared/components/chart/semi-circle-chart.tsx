import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// 동적 import로 ApexCharts 로드 (SSR 비활성화)
const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/**
 * 반원 차트 컴포넌트 Props
 */
interface SemiCircleChartProps {
  /** 차트에 표시할 데이터 값 (0-100 사이의 숫자) */
  series: number;
  /** 차트 색상 */
  color: string;
  /** Track 배경 색상 (기본값: #EAEBF3) */
  trackBackground?: string;
}

/**
 * SemiCircleChart 컴포넌트
 *
 * 180도 반원형 진행률 차트 컴포넌트입니다.
 * ApexCharts를 사용하여 구현되었으며, props가 변경될 때마다 자동으로 차트를 갱신합니다.
 *
 * @param series - 차트에 표시할 데이터 값 (0-100 사이의 숫자)
 * @param color - 차트 색상
 * @returns 반원형 차트 컴포넌트
 */
export function SemiCircleChart({
  series,
  color,
  trackBackground = "#EAEBF3",
}: SemiCircleChartProps) {
  // series를 동적으로 업데이트
  const chartSeries = useMemo(() => [series], [series]);

  // props가 변경될 때마다 차트 옵션을 갱신
  const chartOptions = useMemo(
    (): ApexOptions => ({
      chart: {
        type: "radialBar",
        offsetY: -10,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: "65%",
          },
          track: {
            background: trackBackground,
            strokeWidth: "100%",
            margin: 0,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: [color],
      stroke: {
        lineCap: "round",
      },
    }),
    [color, trackBackground],
  );

  return (
    <DynamicApexChart
      options={chartOptions}
      series={chartSeries}
      type="radialBar"
      width="100%"
      height={180}
    />
  );
}
