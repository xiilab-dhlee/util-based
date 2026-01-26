import { GPU_CHART_COLORS } from "@/domain/monitoring/utils/monitoring.util";
import type { WorkspaceMetricType } from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import type { MetricInfo } from "@/shared/types/metric-info.type";

/**
 * Workspace metric type to display information mapping
 * - Includes text (display name), unit, and colors for charts
 */
const WORKSPACE_METRIC_MAP: Record<WorkspaceMetricType, MetricInfo> = {
  GPU: {
    text: "GPU",
    unit: "개",
    colors: GPU_CHART_COLORS,
  },
  CPU: {
    text: "CPU",
    unit: "Core",
    colors: ["#376DFF"],
  },
  MEM: {
    text: "Memory",
    unit: "GB",
    colors: ["#55D398"],
  },
};

/**
 * Get workspace metric display information
 * @param type - Workspace metric type ('CPU' | 'MEM')
 * @returns Metric information (text, unit, colors)
 */
export function getWorkspaceMetricInfo(type: WorkspaceMetricType): MetricInfo {
  return WORKSPACE_METRIC_MAP[type];
}

/**
 * Get workspace metric display name
 * @param type - Workspace metric type
 * @returns Display name (e.g., "CPU", "Memory")
 */
export function getWorkspaceMetricText(type: WorkspaceMetricType): string {
  return WORKSPACE_METRIC_MAP[type].text;
}

/**
 * Get workspace metric unit
 * @param type - Workspace metric type
 * @returns Unit string (e.g., "Core", "GB")
 */
export function getWorkspaceMetricUnit(type: WorkspaceMetricType): string {
  return WORKSPACE_METRIC_MAP[type].unit;
}

/**
 * Get workspace metric color
 * @param type - Workspace metric type
 * @returns Primary color for the metric
 */
export function getWorkspaceMetricColor(type: WorkspaceMetricType): string {
  return WORKSPACE_METRIC_MAP[type].colors[0];
}
