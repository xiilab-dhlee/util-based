import type { ApexOptions } from "apexcharts";

import type { GetResourceMetricsTimeseriesMetricsName } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// ===== METRIC TYPE ENUM (Frontend) =====
export const WORKSPACE_METRIC_TYPE = {
  GPU: "GPU",
  CPU: "CPU",
  MEM: "MEM",
} as const;

export type WorkspaceMetricType =
  (typeof WORKSPACE_METRIC_TYPE)[keyof typeof WORKSPACE_METRIC_TYPE];

// ===== API ENUM MAPPING (Backend) =====
export const WORKSPACE_METRIC_API_ENUM = {
  GPU: "GPU_REQUESTED_TOTAL_COUNT",
  CPU: "CPU_REQUESTED_TOTAL_CORE",
  MEM: "MEM_REQUESTED_TOTAL_BYTE",
} as const;

/**
 * Convert frontend metric type → backend API enum parameter
 * @param metricType - Frontend metric type ('CPU' | 'MEM')
 * @returns Backend API enum ('CPU_REQUESTED_TOTAL_CORE' | 'MEM_REQUESTED_TOTAL_BYTE')
 */
export function getMetricsNameParam(
  metricType: WorkspaceMetricType,
): GetResourceMetricsTimeseriesMetricsName {
  return WORKSPACE_METRIC_API_ENUM[metricType];
}

// ===== DROPDOWN OPTIONS =====
export const WORKSPACE_MONITORING_RESOURCE_OPTIONS = [
  { label: "GPU", value: WORKSPACE_METRIC_TYPE.GPU },
  { label: "CPU", value: WORKSPACE_METRIC_TYPE.CPU },
  { label: "Memory", value: WORKSPACE_METRIC_TYPE.MEM },
];

// ===== BUFFER CONFIGURATION =====
export const DEFAULT_BUFFER_SIZE = 5000;

// ===== TIME RANGES =====
export const INITIAL_HISTORY_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_STEP = "15s";

// ===== SSE CONFIGURATION =====
export const WORKSPACE_SSE_EVENT_NAME = "workspace-resource-metrics";

// ===== CHART COLOR OPTIONS =====
export const WORKSPACE_MONITORING_CHART_COLORS = {
  axisBorder: "#636777",
  axisLabel: "rgba(245, 245, 245, 0.9)",
  gridBorder: "rgba(255, 255, 255, 0.2)",
  gradientTo: "#1C212E",
} as const;

export const WORKSPACE_MONITORING_CHART_COLOR_OPTIONS: ApexOptions = {
  xaxis: {
    axisBorder: {
      show: true,
      offsetY: -1,
      color: WORKSPACE_MONITORING_CHART_COLORS.axisBorder,
    },
    labels: {
      style: {
        colors: WORKSPACE_MONITORING_CHART_COLORS.axisLabel,
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: WORKSPACE_MONITORING_CHART_COLORS.axisBorder,
      offsetX: -1,
      offsetY: -2,
    },
    labels: {
      style: {
        colors: WORKSPACE_MONITORING_CHART_COLORS.axisLabel,
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
    },
  },
  grid: {
    borderColor: WORKSPACE_MONITORING_CHART_COLORS.gridBorder,
  },
};
