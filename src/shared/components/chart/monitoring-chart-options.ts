import type { ApexOptions } from "apexcharts";

interface ApexOptionsWithSelection extends ApexOptions {
  selection?: {
    enabled: boolean;
    type: "x";
    fill: {
      color: string;
      opacity: number;
    };
    stroke: {
      width: number;
      color: string;
      opacity: number;
    };
  };
}

interface MonitoringChartOptionsParams {
  unit: string;
  colors?: string[];
  chartId: string;
  chartType: "line" | "bar" | "area";
  onChartReady?: (chart: unknown) => void;
  onSelectRange?: (range: { start: Date; end: Date }) => void;
}

export function buildMonitoringChartOptions({
  unit,
  colors,
  chartId,
  chartType,
  onChartReady,
  onSelectRange,
}: MonitoringChartOptionsParams): ApexOptions {
  const shouldEnableSelection = typeof onSelectRange === "function";

  const buildRangeHandler =
    (callback: (range: { start: Date; end: Date }) => void) =>
    (_chart: unknown, context: { xaxis?: { min?: number; max?: number } }) => {
      const { xaxis } = context;
      if (typeof xaxis?.min !== "number" || typeof xaxis.max !== "number") {
        return;
      }

      const start = new Date(xaxis.min);
      const end = new Date(xaxis.max);

      callback({ start, end });
    };

  const baseOptions: ApexOptionsWithSelection = {
    chart: {
      id: chartId,
      type: chartType,
      events: {
        ...(onChartReady && {
          mounted: (chart: unknown) => {
            onChartReady(chart);
          },
        }),
        ...(onSelectRange && {
          // selection / zoomed 둘 다 같은 핸들러로 연결하여
          // 어떤 이벤트가 발생해도 range를 상위로 전달합니다.
          selection: buildRangeHandler(onSelectRange),
          zoomed: buildRangeHandler(onSelectRange),
        }),
      },
      zoom: {
        // 드래그 제스처를 활성화 (Zoomable Timeseries 패턴)
        enabled: shouldEnableSelection,
        type: "x",

        allowMouseWheelZoom: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      curve: "smooth",
      dashArray: [0, 0],
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
        offsetY: -1,
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
    yaxis: {
      tickAmount: 5,
      axisBorder: { show: false },
      labels: {
        formatter: (value: number) => `${value}${unit}`,
      },
    },
    colors,
    grid: {
      strokeDashArray: 2,
    },
    legend: {
      show: false,
    },
  };

  if (chartType === "area") {
    baseOptions.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 99, 100],
      },
    };
  }

  if (chartType === "line") {
    baseOptions.stroke = {
      ...baseOptions.stroke,
      width: 2,
    };
  }

  if (!shouldEnableSelection) {
    return baseOptions;
  }

  baseOptions.selection = {
    enabled: true,
    type: "x",
    fill: {
      color: "#4042D5",
      opacity: 0.2,
    },
    stroke: {
      width: 1,
      color: "#4042D5",
      opacity: 0.8,
    },
  };

  return baseOptions;
}
