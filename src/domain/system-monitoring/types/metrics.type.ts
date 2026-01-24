import type {
  BatchSystemMetricRequestMetricsItem,
  GpuTimeseriesData,
  SystemMetricValue,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { MetricExtractStatus } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type { RingBufferState } from "@/domain/system-monitoring/utils/ring-buffer.util";

export type { MetricExtractStatus };

/**
 * 메트릭 값 (시스템/GPU 공용)
 */
export type MetricValue = SystemMetricValue;

/**
 * 메트릭 추출 결과 (제네릭)
 */
export interface MetricExtractResult<T> {
  /** 추출된 데이터 배열 */
  data: T[];
  /** 추출 상태 */
  status: MetricExtractStatus;
  /** 에러 메시지 (FAILED 상태일 때) */
  error: string | null;
}

/**
 * 시스템 메트릭 시리즈 (단일 메트릭) - 순수 데이터만 포함
 */
export interface SystemMetricSeries {
  /** 차트에 표시할 시리즈 이름 */
  seriesName: string;
  /** API 메트릭 이름 */
  metricName: BatchSystemMetricRequestMetricsItem;
  /** 시계열 데이터 */
  data: MetricValue[];
}

/**
 * 시스템 메트릭 시리즈 그룹 (전체 시스템 메트릭)
 */
export interface SystemMetricSeriesGroup {
  /** CPU 사용률 */
  cpuUtilization: SystemMetricSeries;
  /** CPU 온도 */
  cpuTemperature: SystemMetricSeries;
  /** 메모리 사용률 */
  memoryUtilization: SystemMetricSeries;
  /** 디스크 사용률 */
  diskUtilization: SystemMetricSeries;
  /** 디스크 읽기/쓰기 [Read, Write] */
  diskRw: SystemMetricSeries[];
}

/**
 * 시스템 메트릭별 에러 상태 (boolean)
 */
export interface AllSystemMetricsErrors {
  cpuUtilization: boolean;
  cpuTemperature: boolean;
  memoryUtilization: boolean;
  diskUtilization: boolean;
  /** diskRw는 [Read, Write] 두 개지만 하나의 카드로 표시되므로 단일 에러 */
  diskRw: boolean;
}

/**
 * 시스템 메트릭 버퍼 상태 (SSE 스트리밍용)
 */
export interface SystemMetricBuffers {
  cpuUtilization: RingBufferState<MetricValue>;
  cpuTemperature: RingBufferState<MetricValue>;
  memoryUtilization: RingBufferState<MetricValue>;
  diskUtilization: RingBufferState<MetricValue>;
  diskRead: RingBufferState<MetricValue>;
  diskWrite: RingBufferState<MetricValue>;
}

/**
 * GPU별 버퍼 상태
 */
export interface GpuBufferState {
  modelName: string;
  buffer: RingBufferState<MetricValue>;
}

/**
 * 메트릭별 GPU 데이터 구조
 */
export interface AllGpuMetricsData {
  utilization: GpuTimeseriesData[];
  memory: GpuTimeseriesData[];
  temperature: GpuTimeseriesData[];
  powerUsage: GpuTimeseriesData[];
}

/**
 * 메트릭별 에러 상태 (boolean)
 */
export interface AllGpuMetricsErrors {
  utilization: boolean;
  memory: boolean;
  temperature: boolean;
  powerUsage: boolean;
}

/**
 * GPU 메트릭 버퍼 맵 (gpuIndex → GpuBufferState)
 * @remarks gpuIndex는 API 스키마(GpuTimeseriesData)에서 string 타입
 */
export type GpuMetricBufferMap = Map<string, GpuBufferState>;

/**
 * 전체 GPU 메트릭 버퍼 구조
 */
export interface AllGpuMetricBuffers {
  utilization: GpuMetricBufferMap;
  memory: GpuMetricBufferMap;
  temperature: GpuMetricBufferMap;
  powerUsage: GpuMetricBufferMap;
}

/**
 * 메트릭 훅 공통 파라미터
 */
export interface MetricsHookParams {
  /** 노드명 */
  nodeName: string;
  /** 조회 기간 */
  dateRange: { start: Date; end: Date };
  /** 쿼리 활성화 여부 */
  enabled?: boolean;
}

/**
 * 스트림 훅 공통 파라미터
 */
export interface StreamHookParams {
  /** 노드명 */
  nodeName: string;
  /** History API에서 조회한 마지막 타임스탬프 (SSE 시작점) */
  lastHistoryTimestamp: string | null;
  /** 쿼리 활성화 여부 */
  enabled?: boolean;
  /** 버퍼 최대 크기 */
  bufferSize?: number;
}

/**
 * SSE 연결 상태
 */
export interface SSEConnectionState {
  /** 연결 상태 */
  isConnected: boolean;
  /** 에러 여부 */
  isError: boolean;
  /** 에러 메시지 */
  error: string | null;
}
