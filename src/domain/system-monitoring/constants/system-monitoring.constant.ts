import {
  BatchGpuMetricRequestMetricsItem,
  BatchSystemMetricRequestMetricsItem,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// ============================================================================
// 메트릭 추출 상태
// ============================================================================

/**
 * 메트릭 추출 결과 상태값
 * - SUCCESS: 메트릭 데이터 추출 성공
 * - FAILED: 메트릭 데이터 추출 실패
 * - NOT_REQUESTED: 해당 메트릭을 요청하지 않음
 */
export const METRIC_EXTRACT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  NOT_REQUESTED: "NOT_REQUESTED",
} as const;

export type MetricExtractStatus =
  (typeof METRIC_EXTRACT_STATUS)[keyof typeof METRIC_EXTRACT_STATUS];

// ============================================================================
// 시간 및 버퍼 설정
// ============================================================================

/**
 * history 모드에서 사용할 최소 기간(ms)
 * - 시스템 모니터링 차트 히스토리 조회 시, 최소 1분 구간을 보장합니다.
 */
export const MIN_HISTORY_RANGE_MS = 60 * 1000;

/**
 * Live 모드 초기 History 데이터 로드 범위 (ms)
 * - Live 모드 진입 시 SSE 연결 전에 최근 10분의 데이터를 History API로 로드합니다.
 */
export const LIVE_HISTORY_DEFAULT_RANGE = 10 * 60 * 1000;

/**
 * History API step 계산용 최대 데이터 포인트 수
 *
 * - 용도: History API 요청 시 step 간격 계산
 * - 조회 기간이 길수록 step을 늘려 포인트 수를 제한
 */
export const MAX_CHART_POINTS = 5000;

/**
 * SSE 스트리밍용 링 버퍼 크기
 *
 * - 용도: Live 모드 SSE 데이터 버퍼
 * - 메모리 내 최근 N개 데이터 유지 (FIFO)
 */
export const DEFAULT_BUFFER_SIZE = 5000;

/**
 * SSE 재연결 최대 시도 횟수
 */
export const SSE_RECONNECT_ATTEMPTS = 3;

// ============================================================================
// 시스템 메트릭 상수
// ============================================================================

/**
 * 모든 시스템 메트릭 타입 (단일 소스)
 * - HTTP API, SSE 모두 동일한 상수 사용
 */
export const ALL_SYSTEM_METRICS = [
  BatchSystemMetricRequestMetricsItem.CPU_UTILIZATION,
  BatchSystemMetricRequestMetricsItem.CPU_TEMPERATURE,
  BatchSystemMetricRequestMetricsItem.MEMORY_UTILIZATION,
  BatchSystemMetricRequestMetricsItem.DISK_UTILIZATION,
  BatchSystemMetricRequestMetricsItem.DISK_READ,
  BatchSystemMetricRequestMetricsItem.DISK_WRITE,
] as const;

/**
 * 시스템 메트릭 버퍼 키
 * - 스트림 훅에서 버퍼 관리 시 사용
 */
export const SYSTEM_METRIC_BUFFER_KEYS = [
  "cpuUtilization",
  "cpuTemperature",
  "memoryUtilization",
  "diskUtilization",
  "diskRead",
  "diskWrite",
] as const;

export type SystemMetricBufferKey = (typeof SYSTEM_METRIC_BUFFER_KEYS)[number];

/**
 * API 메트릭 enum → 버퍼 키 매핑
 */
export const SYSTEM_METRIC_TO_BUFFER_KEY: Record<
  BatchSystemMetricRequestMetricsItem,
  SystemMetricBufferKey | null
> = {
  [BatchSystemMetricRequestMetricsItem.CPU_UTILIZATION]: "cpuUtilization",
  [BatchSystemMetricRequestMetricsItem.CPU_TEMPERATURE]: "cpuTemperature",
  [BatchSystemMetricRequestMetricsItem.MEMORY_UTILIZATION]: "memoryUtilization",
  [BatchSystemMetricRequestMetricsItem.DISK_UTILIZATION]: "diskUtilization",
  [BatchSystemMetricRequestMetricsItem.DISK_READ]: "diskRead",
  [BatchSystemMetricRequestMetricsItem.DISK_WRITE]: "diskWrite",
  // 사용하지 않는 메트릭
  [BatchSystemMetricRequestMetricsItem.CPU_LOAD_AVERAGE]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_NETWORK_RECEIVE]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_NETWORK_TRANSMIT]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_MEMORY_BUFFERS]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_MEMORY_CACHED]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_MEMORY_TOTAL]: null,
  [BatchSystemMetricRequestMetricsItem.NODE_MEMORY_FREE]: null,
};

// ============================================================================
// GPU 메트릭 상수
// ============================================================================

/**
 * 모든 GPU 메트릭 타입 (단일 소스)
 * - HTTP API, SSE 모두 동일한 상수 사용
 */
export const ALL_GPU_METRICS = [
  BatchGpuMetricRequestMetricsItem.GPU_UTILIZATION,
  BatchGpuMetricRequestMetricsItem.GPU_MEMORY_UTILIZATION,
  BatchGpuMetricRequestMetricsItem.GPU_TEMPERATURE,
  BatchGpuMetricRequestMetricsItem.GPU_POWER_USAGE,
] as const;

/**
 * GPU 메트릭 버퍼 키
 * - 스트림 훅에서 버퍼 관리 시 사용
 */
export const GPU_METRIC_BUFFER_KEYS = [
  "utilization",
  "memory",
  "temperature",
  "powerUsage",
] as const;

export type GpuMetricBufferKey = (typeof GPU_METRIC_BUFFER_KEYS)[number];

/**
 * API 메트릭 enum → 버퍼 키 매핑
 */
export const GPU_METRIC_TO_BUFFER_KEY: Record<
  BatchGpuMetricRequestMetricsItem,
  GpuMetricBufferKey | null
> = {
  [BatchGpuMetricRequestMetricsItem.GPU_UTILIZATION]: "utilization",
  [BatchGpuMetricRequestMetricsItem.GPU_MEMORY_UTILIZATION]: "memory",
  [BatchGpuMetricRequestMetricsItem.GPU_TEMPERATURE]: "temperature",
  [BatchGpuMetricRequestMetricsItem.GPU_POWER_USAGE]: "powerUsage",
  // 사용하지 않는 메트릭
  [BatchGpuMetricRequestMetricsItem.GPU_FAN_SPEED]: null,
};
