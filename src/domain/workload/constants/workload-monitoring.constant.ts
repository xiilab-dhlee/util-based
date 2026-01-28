import { GetWorkloadResourceMetricsTimeseriesMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 워크로드 메트릭 타입 (4개 고정)
 */
export const ALL_WORKLOAD_METRICS = [
  GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_UTILIZATION,
  GetWorkloadResourceMetricsTimeseriesMetricsItem.GPU_MEM_UTILIZATION,
  GetWorkloadResourceMetricsTimeseriesMetricsItem.CPU_UTILIZATION,
  GetWorkloadResourceMetricsTimeseriesMetricsItem.MEM_UTILIZATION,
] as const;

/**
 * 버퍼 크기
 */
export const DEFAULT_BUFFER_SIZE = 5000;

/**
 * 라이브 모드 진입 시 히스토리 조회 범위 (최근 10분)
 * 시스템 모니터링은 30분
 */
export const LIVE_HISTORY_DEFAULT_RANGE = 10 * 60 * 1000; // 10분

/**
 * 메트릭 추출 상태
 */
export const METRIC_EXTRACT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  NO_DATA: "NO_DATA",
} as const;

export type MetricExtractStatus =
  (typeof METRIC_EXTRACT_STATUS)[keyof typeof METRIC_EXTRACT_STATUS];
