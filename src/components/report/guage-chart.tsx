import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";

interface DataListProps {
  title?: string;
  data: any;
  width?: number;
  height?: number;
  colors?: string[];
}

export const GaugeChart = ({ data, title, width, height, colors }: DataListProps) => {
  const series = {
    title: title,
    yaxis: data,
    group: "social",
    height: height,
    width: width,
  };
  const seriesData = data;

  const chartOptions: ApexOptions = {
    series: data,
    chart: {
      id: "GaugeChart",
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        dataLabels: {
          show: false,
        },
        track: {
          background: "#F0F0F6",
        },
      },
    },
    fill: {
      type: "solid",

      colors: colors,
    },
    stroke: {
      lineCap: "round",
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (!seriesData || !chartOptions || !series) return <></>;

  return (
    <div id={title}>
      <DynamicApexChart
        series={seriesData}
        options={chartOptions}
        width={series.width ? series.width : 250}
        height={series.height ? series.height : 250}
        type="radialBar"
      />
    </div>
  );
};

const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

