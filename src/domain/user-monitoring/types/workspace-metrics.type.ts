import type { ChartDataSeries } from "@/shared/utils/chart.util";

// ===== USE EXISTING CHART TYPES =====
// ChartDataSeries from system-monitoring pattern:
// {
//   type: 'area' | 'line' | 'bar',
//   name: string,
//   data: { x: Date, y: number }[]
// }

// ===== METRIC EXTRACTION =====
export type MetricExtractStatus = "success" | "error" | "empty";

export interface MetricExtractionResult {
  status: MetricExtractStatus;
  data: ChartDataSeries[]; // Array of series (even for single metric)
  error?: string;
}
