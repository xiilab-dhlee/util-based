import { subHours } from "date-fns";
import { HttpResponse, http } from "msw";

import type {
  BaseResponseBatchGpuMetricResponse,
  BaseResponseBatchSystemMetricResponse,
  GpuTimeseriesData,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { MetricValue } from "@/domain/system-monitoring/types/metrics.type";

/**
 * 날짜를 API 형식으로 포맷
 * 백엔드와 동일한 UTC ISO 8601 형식을 사용합니다.
 * 예: "2024-01-15T09:30:00.000Z"
 */
function formatApiDate(date: Date): string {
  return date.toISOString();
}

/**
 * 시계열 데이터 포인트 생성
 */
function generateTimeSeriesData(
  hours: number,
  valueGenerator: (hour: number) => number,
): { dateTime: string; value: string }[] {
  const now = new Date();
  const points: { dateTime: string; value: string }[] = [];

  for (let i = hours; i >= 0; i--) {
    const time = subHours(now, i);
    points.push({
      dateTime: formatApiDate(time),
      value: valueGenerator(hours - i).toFixed(2),
    });
  }

  return points;
}

/**
 * GPU 메트릭 mock 데이터 생성
 */
function generateGpuMetricData(
  metricName: string,
  hours = 24,
): GpuTimeseriesData[] {
  // GPU 목록 (실제 테스트용)
  const gpus = [
    { modelName: "NVIDIA A100", gpuIndex: "0" },
    { modelName: "NVIDIA A100", gpuIndex: "1" },
    { modelName: "NVIDIA V100", gpuIndex: "2" },
  ];

  return gpus.map((gpu, idx) => {
    const baseValue = 30 + idx * 10; // GPU마다 다른 기본값

    const valueGenerator = (hour: number): number => {
      switch (metricName) {
        case "GPU_UTILIZATION":
          // 40-90% 사이 랜덤 + 시간대별 변동
          return baseValue + Math.sin(hour / 4) * 20 + Math.random() * 10;
        case "GPU_MEMORY_UTILIZATION":
          // 바이트 단위 (8~16GB)
          return (8 + idx * 2 + Math.random() * 4) * 1024 * 1024 * 1024;
        case "GPU_TEMPERATURE":
          // 50-80°C
          return 50 + idx * 5 + Math.sin(hour / 6) * 10 + Math.random() * 5;
        case "GPU_FAN_SPEED":
          // 30-70%
          return 30 + idx * 10 + Math.random() * 20;
        case "GPU_POWER_USAGE":
          // 100-300W
          return 100 + idx * 50 + Math.sin(hour / 4) * 30 + Math.random() * 20;
        default:
          return baseValue + Math.random() * 20;
      }
    };

    return {
      modelName: gpu.modelName,
      gpuIndex: gpu.gpuIndex,
      values: generateTimeSeriesData(hours, valueGenerator),
    };
  });
}

/**
 * 시스템 메트릭 mock 데이터 생성
 */
function generateSystemMetricData(
  metricName: string,
  hours = 24,
): MetricValue[] {
  const valueGenerator = (hour: number): number => {
    switch (metricName) {
      case "CPU_UTILIZATION":
        // 20-80%
        return 20 + Math.sin(hour / 4) * 30 + Math.random() * 10;
      case "CPU_TEMPERATURE":
        // 40-70°C
        return 40 + Math.sin(hour / 6) * 15 + Math.random() * 5;
      case "MEMORY_UTILIZATION":
        // 40-85%
        return 40 + Math.sin(hour / 8) * 25 + Math.random() * 10;
      case "DISK_UTILIZATION":
        // 30-70%
        return 30 + hour * 0.5 + Math.random() * 5;
      case "NODE_NETWORK_RECEIVE":
        // 바이트 단위 (100MB ~ 2GB)
        return (
          (100 + Math.sin(hour / 3) * 500 + Math.random() * 200) * 1024 * 1024
        );
      case "NODE_NETWORK_TRANSMIT":
        // 바이트 단위 (50MB ~ 1GB)
        return (
          (50 + Math.sin(hour / 3) * 300 + Math.random() * 100) * 1024 * 1024
        );
      case "DISK_READ":
        // 바이트 단위 (50MB ~ 500MB)
        return (50 + Math.random() * 200) * 1024 * 1024;
      case "DISK_WRITE":
        // 바이트 단위 (30MB ~ 300MB)
        return (30 + Math.random() * 150) * 1024 * 1024;
      case "NODE_MEMORY_BUFFERS":
        // 바이트 단위 (1GB ~ 4GB)
        return (1 + Math.random() * 3) * 1024 * 1024 * 1024;
      case "NODE_MEMORY_CACHED":
        // 바이트 단위 (4GB ~ 16GB)
        return (4 + Math.random() * 12) * 1024 * 1024 * 1024;
      case "NODE_MEMORY_FREE":
        // 바이트 단위 (8GB ~ 32GB)
        return (8 + Math.random() * 24) * 1024 * 1024 * 1024;
      default:
        return 50 + Math.random() * 30;
    }
  };

  return generateTimeSeriesData(hours, valueGenerator);
}

/**
 * GPU 메트릭 이름 → 배치 응답 키 매핑
 */
const GPU_METRIC_KEY_MAP: Record<string, string> = {
  GPU_UTILIZATION: "gpuUtilization",
  GPU_MEMORY_UTILIZATION: "gpuMemoryUtilization",
  GPU_TEMPERATURE: "gpuTemperature",
  GPU_FAN_SPEED: "gpuFanSpeed",
  GPU_POWER_USAGE: "gpuPowerUsage",
};

/**
 * 시스템 메트릭 이름 → 배치 응답 키 매핑
 */
const SYSTEM_METRIC_KEY_MAP: Record<string, string> = {
  CPU_UTILIZATION: "cpuUtilization",
  CPU_TEMPERATURE: "cpuTemperature",
  CPU_LOAD_AVERAGE: "cpuLoadAverage",
  MEMORY_UTILIZATION: "memoryUtilization",
  DISK_UTILIZATION: "diskUtilization",
  DISK_READ: "diskRead",
  DISK_WRITE: "diskWrite",
  NODE_NETWORK_RECEIVE: "nodeNetworkReceive",
  NODE_NETWORK_TRANSMIT: "nodeNetworkTransmit",
  NODE_MEMORY_BUFFERS: "nodeMemoryBuffers",
  NODE_MEMORY_CACHED: "nodeMemoryCached",
  NODE_MEMORY_FREE: "nodeMemoryFree",
};

/**
 * GPU 메트릭 API 오버라이드 핸들러 (배치 응답)
 */
export const gpuMetricsOverrideHandler = http.get<
  { nodeName: string },
  never,
  BaseResponseBatchGpuMetricResponse
>("*/api/v1/cluster/nodes/:nodeName/resources/gpu/metrics", ({ request }) => {
  const url = new URL(request.url);
  const metricsParam = url.searchParams.get("metrics") ?? "GPU_UTILIZATION";
  const metricNames = metricsParam.split(",");

  // 배치 응답 구성
  const batchData: Record<
    string,
    { status: string; data: GpuTimeseriesData[] }
  > = {};

  for (const metricName of metricNames) {
    const key = GPU_METRIC_KEY_MAP[metricName];
    if (key) {
      batchData[key] = {
        status: "SUCCESS",
        data: generateGpuMetricData(metricName),
      };
    }
  }

  return HttpResponse.json({
    status: "SUCCESS",
    data: batchData,
    timestamp: Date.now(),
  });
});

/**
 * 시스템 메트릭 API 오버라이드 핸들러 (배치 응답)
 */
export const systemMetricsOverrideHandler = http.get<
  { nodeName: string },
  never,
  BaseResponseBatchSystemMetricResponse
>(
  "*/api/v1/cluster/nodes/:nodeName/resources/system/metrics",
  ({ request }) => {
    const url = new URL(request.url);
    const metricsParam = url.searchParams.get("metrics") ?? "CPU_UTILIZATION";
    const metricNames = metricsParam.split(",");

    // 배치 응답 구성
    const batchData: Record<string, { status: string; data: MetricValue[] }> =
      {};

    for (const metricName of metricNames) {
      const key = SYSTEM_METRIC_KEY_MAP[metricName];
      if (key) {
        batchData[key] = {
          status: "SUCCESS",
          data: generateSystemMetricData(metricName),
        };
      }
    }

    return HttpResponse.json({
      status: "SUCCESS",
      data: batchData,
      timestamp: Date.now(),
    });
  },
);

/**
 * 시스템 모니터링 메트릭 오버라이드 핸들러 목록
 */
export const systemMonitoringMetricsOverrideHandlers = [
  gpuMetricsOverrideHandler,
  systemMetricsOverrideHandler,
];
