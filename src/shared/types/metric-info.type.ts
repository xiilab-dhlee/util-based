/**
 * Metric information interface for chart rendering
 * - text: Metric display name for chart/card titles
 * - unit: Unit symbol for Y-axis/tooltip
 * - colors: Color palette for series (cycling through for multiple series)
 * - series: For multi-series metrics, list of series keys
 */
export interface MetricInfo {
  text: string;
  unit: string;
  colors: readonly string[];
  series?: string[];
}
