import type { GpuTimeseriesData } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import type { SystemMetricSeries } from "@/domain/system-monitoring/types/metrics.type";
import type { ChartDataSeries } from "@/shared/utils/chart.util";
import { convertBytes } from "@/shared/utils/resource.util";

/**
 * GB 변환이 필요한 메트릭 타입 목록
 * API 응답이 바이트 단위이므로 GB로 변환 필요
 */
const BYTES_TO_GB_METRICS: MonitoringMetricType[] = [
  "memory-detail",
  "network-rt",
  "disk-rw",
];

/**
 * 바이트 값을 GB로 변환 (필요한 메트릭만)
 */
function convertValueIfNeeded(
  value: number,
  metricType: MonitoringMetricType,
): number {
  if (BYTES_TO_GB_METRICS.some((m) => m === metricType)) {
    return convertBytes(value, "GB", 2).value;
  }
  return value;
}

/**
 * GPU 메트릭 API 응답 → ApexCharts 시리즈 변환
 *
 * NodeGpuMetricResponse[] 형식을 차트 데이터로 변환합니다.
 * GPU별로 멀티 시리즈를 생성합니다.
 *
 * @param data - GPU 메트릭 API 응답 배열
 * @param metricType - 메트릭 타입 (단위 변환용)
 * @param chartType - 차트 타입 (기본: line)
 * @returns ApexCharts 시리즈 데이터 배열
 *
 * @example
 * const chartData = mapGpuMetricsToChartData(gpuData, "gpu-utilization");
 */
export function mapGpuMetricsToChartData(
  data: GpuTimeseriesData[],
  metricType: MonitoringMetricType,
  chartType: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  if (!data || data.length === 0) {
    return [];
  }

  return data.map((gpu) => ({
    type: chartType,
    name: `${gpu.modelName}-${gpu.gpuIndex}`,
    data: gpu.values
      .filter((point) => !Number.isNaN(parseFloat(point.value)))
      .map((point) => ({
        x: new Date(point.dateTime),
        y: convertValueIfNeeded(parseFloat(point.value), metricType),
      })),
  }));
}

/**
 * 시스템 메트릭 시리즈 → ApexCharts 시리즈 변환
 *
 * useSystemMetrics 훅의 출력(SystemMetricSeries[])을 차트 데이터로 변환합니다.
 * 단일/멀티 시리즈 모두 지원합니다.
 *
 * @param series - useSystemMetrics 훅의 시리즈 배열
 * @param metricType - 메트릭 타입 (단위 변환용)
 * @param chartType - 차트 타입 (기본: line)
 * @returns ApexCharts 시리즈 데이터 배열
 *
 * @example
 * const chartData = mapSystemMetricsSeriesToChartData(series, "cpu-utilization");
 */
export function mapSystemMetricsSeriesToChartData(
  series: SystemMetricSeries[],
  metricType: MonitoringMetricType,
  chartType: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  if (!series || series.length === 0) {
    return [];
  }

  return series
    .filter((s) => s.data.length > 0)
    .map((s) => ({
      type: chartType,
      name: s.seriesName,
      data: s.data
        .filter((point) => !Number.isNaN(parseFloat(point.value)))
        .map((point) => ({
          x: new Date(point.dateTime),
          y: convertValueIfNeeded(parseFloat(point.value), metricType),
        })),
    }));
}
