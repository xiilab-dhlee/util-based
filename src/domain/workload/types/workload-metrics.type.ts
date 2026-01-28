import type { GetWorkloadResourceMetricsTimeseriesMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 메트릭 데이터 포인트
 */
export interface MetricValue {
  dateTime: string;
  value: string;
  podName?: string;
  gpuIndex?: string;
  modelName?: string;
}

/**
 * 단일 메트릭 시리즈
 */
export interface WorkloadMetricSeries {
  seriesName: string;
  metricName: GetWorkloadResourceMetricsTimeseriesMetricsItem;
  data: MetricValue[];
}

/**
 * 워크로드 메트릭 그룹 (4개 메트릭)
 */
export interface WorkloadMetricSeriesGroup {
  gpuUtilization: WorkloadMetricSeries;
  gpuMemUtilization: WorkloadMetricSeries;
  cpuUtilization: WorkloadMetricSeries;
  memUtilization: WorkloadMetricSeries;
  isEmpty?: boolean; // 데이터가 없는 경우 (비활성 워크로드)
}

/**
 * 워크로드 메트릭 에러 상태
 */
export interface WorkloadMetricsErrors {
  gpuUtilization: boolean;
  gpuMemUtilization: boolean;
  cpuUtilization: boolean;
  memUtilization: boolean;
}
