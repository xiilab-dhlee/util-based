import {
  type BatchGpuMetricResponse,
  type BatchSystemMetricResponse,
  GetNodeGpuMetricsMetricsItem,
  GetNodeSystemMetricsMetricsItem,
  type GpuTimeseriesData,
  type MetricResult,
  type SystemMetricResult,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import {
  METRIC_EXTRACT_STATUS,
  type MetricExtractStatus,
} from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type { MetricValue } from "@/domain/system-monitoring/types/metrics.type";

export const GPU_METRIC_TYPES: MonitoringMetricType[] = [
  "gpu-utilization",
  "gpu-memory",
  "gpu-temperature",
  "gpu-fan-speed",
  "gpu-power-usage",
];

/**
 * GPU 메트릭 타입인지 확인
 */
export function isGpuMetricType(type: MonitoringMetricType): boolean {
  return GPU_METRIC_TYPES.includes(type);
}

/**
 * 프론트엔드 GPU 메트릭 타입 → API GPU 메트릭 이름 변환
 */
const GPU_METRIC_MAP: Partial<
  Record<MonitoringMetricType, GetNodeGpuMetricsMetricsItem | undefined>
> = {
  "gpu-utilization": GetNodeGpuMetricsMetricsItem.GPU_UTILIZATION,
  "gpu-memory": GetNodeGpuMetricsMetricsItem.GPU_MEMORY_UTILIZATION,
  "gpu-temperature": GetNodeGpuMetricsMetricsItem.GPU_TEMPERATURE,
  "gpu-fan-speed": GetNodeGpuMetricsMetricsItem.GPU_FAN_SPEED,
  "gpu-power-usage": GetNodeGpuMetricsMetricsItem.GPU_POWER_USAGE,
};

/**
 * GPU 메트릭 타입 → API 메트릭 이름 변환
 *
 * 시스템 메트릭 타입이나 알 수 없는 타입은 null 반환
 */
export function toGpuMetricName(
  type: MonitoringMetricType,
): GetNodeGpuMetricsMetricsItem | null {
  return GPU_METRIC_MAP[type] ?? null;
}

/**
 * 프론트엔드 시스템 메트릭 타입 → API 시스템 메트릭 이름 변환
 *
 * 단일 메트릭: 1:1 매핑
 * 멀티시리즈 메트릭: 배열로 반환
 */
const SYSTEM_METRIC_MAP: Partial<
  Record<MonitoringMetricType, GetNodeSystemMetricsMetricsItem[] | undefined>
> = {
  "cpu-utilization": [GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION],
  "cpu-temperature": [GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE],
  "cpu-load-average": [GetNodeSystemMetricsMetricsItem.CPU_LOAD_AVERAGE],
  "memory-utilization": [GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION],
  "memory-detail": [
    GetNodeSystemMetricsMetricsItem.NODE_MEMORY_BUFFERS,
    GetNodeSystemMetricsMetricsItem.NODE_MEMORY_CACHED,
    GetNodeSystemMetricsMetricsItem.NODE_MEMORY_FREE,
  ],
  "disk-utilization": [GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION],
  "disk-rw": [
    GetNodeSystemMetricsMetricsItem.DISK_READ,
    GetNodeSystemMetricsMetricsItem.DISK_WRITE,
  ],
  "network-rt": [
    GetNodeSystemMetricsMetricsItem.NODE_NETWORK_RECEIVE,
    GetNodeSystemMetricsMetricsItem.NODE_NETWORK_TRANSMIT,
  ],
};

/**
 * 시스템 메트릭 타입에 해당하는 API 메트릭 이름 배열 반환
 *
 * GPU 메트릭 타입이나 알 수 없는 타입은 빈 배열 반환 (에러 없이 처리)
 *
 * @example
 * toSystemMetricNames("cpu-utilization") // ["CPU_UTILIZATION"]
 * toSystemMetricNames("network-rt") // ["NODE_NETWORK_RECEIVE", "NODE_NETWORK_TRANSMIT"]
 * toSystemMetricNames("gpu-utilization") // [] (GPU는 별도 API 사용)
 */
export function toSystemMetricNames(
  type: MonitoringMetricType,
): GetNodeSystemMetricsMetricsItem[] {
  const metricNames = SYSTEM_METRIC_MAP[type];
  // GPU 메트릭 타입이나 알 수 없는 타입은 빈 배열 반환
  return metricNames ?? [];
}

/**
 * API 메트릭 이름 → 차트 시리즈 이름 변환 (멀티시리즈용)
 */
const SERIES_NAME_MAP: Record<GetNodeSystemMetricsMetricsItem, string> = {
  [GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION]: "CPU 사용률",
  [GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE]: "CPU 온도",
  [GetNodeSystemMetricsMetricsItem.CPU_LOAD_AVERAGE]: "CPU 부하",
  [GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION]: "Memory 사용률",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_BUFFERS]: "Buffers",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_CACHED]: "Cached",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_TOTAL]: "Total",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_FREE]: "Free",
  [GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION]: "Disk 사용률",
  [GetNodeSystemMetricsMetricsItem.DISK_READ]: "Read",
  [GetNodeSystemMetricsMetricsItem.DISK_WRITE]: "Write",
  [GetNodeSystemMetricsMetricsItem.NODE_NETWORK_RECEIVE]: "Receive",
  [GetNodeSystemMetricsMetricsItem.NODE_NETWORK_TRANSMIT]: "Transmit",
};

export function toSeriesName(
  metricName: GetNodeSystemMetricsMetricsItem,
): string {
  return SERIES_NAME_MAP[metricName] ?? metricName;
}

/**
 * 배치 응답에서 추출한 결과 타입
 */
export interface ExtractResult<T> {
  /** 추출된 데이터 배열 */
  data: T[];
  /** 추출 상태: SUCCESS(성공), FAILED(실패), NOT_REQUESTED(요청하지 않음) */
  status: MetricExtractStatus;
  /** 에러 메시지 (FAILED 상태일 때) */
  error: string | null;
}

/**
 * GPU 메트릭 타입 → 배치 응답 키 매핑
 */
const GPU_RESPONSE_KEY_MAP: Partial<
  Record<MonitoringMetricType, keyof BatchGpuMetricResponse | undefined>
> = {
  "gpu-utilization": "gpuUtilization",
  "gpu-memory": "gpuMemoryUtilization",
  "gpu-temperature": "gpuTemperature",
  "gpu-fan-speed": "gpuFanSpeed",
  "gpu-power-usage": "gpuPowerUsage",
};

/**
 * 배치 GPU 메트릭 응답에서 특정 메트릭 데이터 추출
 *
 * @param response - BatchGpuMetricResponse (API 응답)
 * @param metricType - 추출할 메트릭 타입 (gpu-utilization, gpu-memory 등)
 * @returns ExtractResult<GpuTimeseriesData> - 추출된 데이터와 상태
 *
 * @example
 * const result = extractGpuMetricData(batchResponse, "gpu-utilization");
 * if (result.status === "SUCCESS") {
 *   // result.data: GpuTimeseriesData[]
 * } else if (result.status === "FAILED") {
 *   // result.error: "timeout" | "network_error" | "query_error" 등
 * }
 */
export function extractGpuMetricData(
  response: BatchGpuMetricResponse | undefined,
  metricType: MonitoringMetricType,
): ExtractResult<GpuTimeseriesData> {
  if (!response) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }

  const key = GPU_RESPONSE_KEY_MAP[metricType];
  if (!key) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }

  const result = response[key] as MetricResult | undefined;
  if (!result) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }
  if (result.status === METRIC_EXTRACT_STATUS.FAILED) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.FAILED,
      error: result.error ?? "unknown_error",
    };
  }
  return {
    data: result.data ?? [],
    status: METRIC_EXTRACT_STATUS.SUCCESS,
    error: null,
  };
}

/**
 * 시스템 메트릭 이름 → 배치 응답 키 매핑
 */
const SYSTEM_RESPONSE_KEY_MAP: Partial<
  Record<GetNodeSystemMetricsMetricsItem, keyof BatchSystemMetricResponse>
> = {
  [GetNodeSystemMetricsMetricsItem.CPU_UTILIZATION]: "cpuUtilization",
  [GetNodeSystemMetricsMetricsItem.CPU_TEMPERATURE]: "cpuTemperature",
  [GetNodeSystemMetricsMetricsItem.CPU_LOAD_AVERAGE]: "cpuLoadAverage",
  [GetNodeSystemMetricsMetricsItem.NODE_NETWORK_RECEIVE]: "nodeNetworkReceive",
  [GetNodeSystemMetricsMetricsItem.NODE_NETWORK_TRANSMIT]:
    "nodeNetworkTransmit",
  [GetNodeSystemMetricsMetricsItem.DISK_READ]: "diskRead",
  [GetNodeSystemMetricsMetricsItem.DISK_WRITE]: "diskWrite",
  [GetNodeSystemMetricsMetricsItem.DISK_UTILIZATION]: "diskUtilization",
  [GetNodeSystemMetricsMetricsItem.MEMORY_UTILIZATION]: "memoryUtilization",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_BUFFERS]: "nodeMemoryBuffers",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_CACHED]: "nodeMemoryCached",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_TOTAL]: "nodeMemoryTotal",
  [GetNodeSystemMetricsMetricsItem.NODE_MEMORY_FREE]: "nodeMemoryFree",
};

export function extractSystemMetricData(
  response: BatchSystemMetricResponse | undefined,
  metricName: GetNodeSystemMetricsMetricsItem,
): ExtractResult<MetricValue> {
  if (!response) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }

  const key = SYSTEM_RESPONSE_KEY_MAP[metricName];
  if (!key) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }

  const result = response[key] as SystemMetricResult | undefined;
  if (!result) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.NOT_REQUESTED,
      error: null,
    };
  }
  if (result.status === METRIC_EXTRACT_STATUS.FAILED) {
    return {
      data: [],
      status: METRIC_EXTRACT_STATUS.FAILED,
      error: result.error ?? "unknown_error",
    };
  }
  return {
    data: result.data ?? [],
    status: METRIC_EXTRACT_STATUS.SUCCESS,
    error: null,
  };
}
