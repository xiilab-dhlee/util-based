import type { WorkloadMetricSeries } from "@/domain/workload/types/workload-metrics.type";
import type { WorkloadMonitoringMetricType } from "@/domain/workload/utils/workload-monitoring.util";
import type { ChartDataSeries } from "@/shared/utils/chart.util";

/**
 * 워크로드 메트릭 시리즈 → ApexCharts 시리즈 변환
 *
 * useWorkloadMetrics 훅의 출력(WorkloadMetricSeries)을 차트 데이터로 변환합니다.
 * Pod별, GPU별로 멀티 시리즈를 생성합니다.
 *
 * @param seriesData - useWorkloadMetrics 훅의 시리즈
 * @param metricType - 메트릭 타입
 * @param chartType - 차트 타입 (기본: line)
 * @returns ApexCharts 시리즈 데이터 배열
 *
 * @example
 * const chartData = mapWorkloadMetricSeriesToChartData(
 *   data.gpuUtilization,
 *   "gpu-utilization"
 * );
 */
export function mapWorkloadMetricSeriesToChartData(
  seriesData: WorkloadMetricSeries,
  metricType: WorkloadMonitoringMetricType,
  chartType: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  if (!seriesData || seriesData.data.length === 0) {
    return [];
  }

  const isGpuMetric =
    metricType === "gpu-utilization" || metricType === "gpu-memory";

  // Pod별, GPU별로 데이터 그룹화
  const groupedData = seriesData.data.reduce(
    (acc, item) => {
      let key: string;

      if (isGpuMetric) {
        // GPU 지표: Pod-GPU 조합별 시리즈
        if (item.podName && item.gpuIndex !== undefined) {
          key = `${item.podName}-GPU${item.gpuIndex}`;
        } else if (item.gpuIndex !== undefined) {
          key = `GPU${item.gpuIndex}`;
        } else {
          key = seriesData.seriesName;
        }
      } else {
        // CPU/Memory 지표: 단일 시리즈 (제목 = 항목명)
        key = seriesData.seriesName;
      }

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push({
        x: new Date(item.dateTime),
        y: Number.parseFloat(item.value),
      });

      return acc;
    },
    {} as Record<string, Array<{ x: Date; y: number }>>,
  );

  // 각 그룹을 차트 시리즈로 변환
  return Object.entries(groupedData)
    .filter(([, data]) => data.length > 0)
    .map(([name, data]) => ({
      type: chartType,
      name,
      data: data.filter((point) => !Number.isNaN(point.y)),
    }));
}
