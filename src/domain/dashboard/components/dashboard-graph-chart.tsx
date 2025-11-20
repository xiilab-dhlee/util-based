import type { ApexOptions } from "apexcharts";
import ko from "apexcharts/dist/locales/ko.json";
import dynamic from "next/dynamic";
import { useState } from "react";

import type { CoreChartSeries } from "@/shared/types/core.model";

const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DashboardGraphChartProps {
  series: CoreChartSeries[];
  unit: string;
}

const CHART_CONSTANTS = {
  HOURS_IN_DAY: 24,
  MS_IN_HOUR: 60 * 60 * 1000,
  TICK_AMOUNT: 5,
  CHART_HEIGHT: 330,
};

const getChartOptions = (unit: string): ApexOptions => {
  const now = new Date();
  const oneDayAgo = new Date(
    now.getTime() - CHART_CONSTANTS.HOURS_IN_DAY * CHART_CONSTANTS.MS_IN_HOUR,
  );

  return {
    chart: {
      type: "area",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    stroke: {
      width: [1, 1],
      curve: "straight",
      dashArray: [0, 0],
    },
    legend: { show: false },
    tooltip: {
      hideEmptySeries: false,
      enabled: true,
      x: { format: "yyyy-MM-dd HH:mm" },
    },
    xaxis: {
      type: "datetime",
      min: oneDayAgo.getTime(),
      max: now.getTime(),
      tickAmount: CHART_CONSTANTS.HOURS_IN_DAY,
      axisBorder: {
        show: true,
        offsetY: -1,
        color: "#636777",
      },
      axisTicks: { show: false },
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
          colors: "rgba(245, 245, 245, 0.9)",
          fontSize: "11px",
          fontWeight: "400",
        },
      },
    },
    yaxis: {
      tickAmount: CHART_CONSTANTS.TICK_AMOUNT,
      axisBorder: {
        show: true,
        color: "#636777",
        offsetX: -1,
        offsetY: -2,
      },
      labels: {
        formatter: (value: number) => `${value}${unit}`,
        style: {
          colors: "rgba(245, 245, 245, 0.9)",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0.4,
        gradientToColors: ["#1C212E"],
      },
    },
    colors: ["#99B0F2"],
    grid: {
      strokeDashArray: 0,
      borderColor: "rgba(255, 255, 255, 0.2)",
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
  };
};

export function DashboardGraphChart({
  series,
  unit,
}: DashboardGraphChartProps) {
  const [state] = useState({
    series,
    locales: [ko],
    defaultLocale: "ko",
    options: getChartOptions(unit),
  });

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DynamicApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={CHART_CONSTANTS.CHART_HEIGHT}
      />
    </div>
  );
}
