"use client";

import type { ApexOptions } from "apexcharts";
import ko from "apexcharts/dist/locales/ko.json";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
interface MonitoringChartProps {
  series: any[];
  height?: number;
  unit: string;
  colors?: string[];
}

export function MonitoringChart({
  series,
  height,
  unit,
  colors,
}: MonitoringChartProps) {
  const [state, setState] = useState({
    series,
    locales: [ko],
    defaultLocale: "ko",
    options: {
      chart: {
        type: "area",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false, // 메뉴바 숨기기
        },
      },
      // 데이터 라벨 숨기기
      dataLabels: {
        enabled: false,
      },
      // 차트 설정
      stroke: {
        // 차트별 너비
        width: [1, 1],
        curve: "smooth",
        // 차트 선 종류 설정
        dashArray: [0, 0],
      },
      // area 차트 fill 설정 (그라데이션 효과)
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0,
          stops: [0, 99, 100],
        },
      },
      tooltip: {
        hideEmptySeries: false,
        enabled: true,
        x: {
          format: "yyyy-MM-dd HH:mm",
        },
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false,
          offsetY: -1, // 점선 가리기
        },
        axisTicks: { show: true },

        labels: {
          datetimeUTC: false,
          datetimeFormatter: {
            year: "yyyy",
            month: "MM/dd",
            day: "MM/dd",
            hour: "HH:mm",
          },
          rotate: 0,
          style: {
            colors: "#7D7D7D",
            fontSize: "12px",
          },
        },
      },
      // y축 설정
      yaxis: {
        // min: 0, // 최소값을 0으로 설정
        // max: 100, // 최대값을 100으로 설정
        tickAmount: 5, // 20 단위로 점프
        // 축 실선 보이기 여부
        axisBorder: { show: false },
        // y축 단위 레이블 설정
        labels: {
          formatter: (value: number) => {
            return `${value}${unit}`; // Y축 값에 '%' 추가
          },
        },
      },
      // line 색상 설정
      colors,
      // y축 grid 선 설정
      grid: {
        strokeDashArray: 2,
      },
      // legend 설정
      legend: {
        show: false,
      },
    },
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      series,
    }));
  }, [series]);

  return (
    <DynamicApexChart
      options={state.options as ApexOptions}
      series={state.series}
      type="area"
      height={height ? height : "100%"}
    />
  );
}

