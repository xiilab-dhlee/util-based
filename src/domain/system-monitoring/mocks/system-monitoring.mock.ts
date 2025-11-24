import type {
  MetricDataPoint,
  ResourceMetricResponse,
  SystemResourcesSummaryResponse,
} from "@/domain/system-monitoring/types/system-monitoring.type";

/**
 * 임시 노드 목록 (백엔드 API 준비 전까지 사용)
 */
export const MOCK_NODE_OPTIONS = [
  { value: "a5000", label: "a5000" },
  { value: "b6000", label: "b6000" },
  { value: "c7000", label: "c7000" },
] as const;

/**
 * Mock 메트릭 데이터 생성 함수 (GPU별)
 */
export function generateMockGpuMetricData(
  gpuNames: string[],
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const dataPoints: MetricDataPoint[] = [];

  // 시간별 데이터 포인트 생성
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    dataPoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 40 + 40).toFixed(1), // 40-80 사이 랜덤 값
    });
  }

  // GPU별 시리즈 생성
  return gpuNames.map((gpuName, index) => ({
    metricName: "mock-metric",
    nodeName,
    prettyName: gpuName,
    modelName: gpuName,
    gpuIndex: index.toString(),
    value: dataPoints.map((point) => ({
      ...point,
      value: (parseFloat(point.value) + Math.random() * 10).toFixed(1), // GPU마다 약간 다른 값
    })),
  }));
}

/**
 * Mock 메트릭 데이터 생성 함수 (노드별)
 */
export function generateMockNodeMetricData(
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const dataPoints: MetricDataPoint[] = [];

  // 시간별 데이터 포인트 생성
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    dataPoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 40 + 40).toFixed(1), // 40-80 사이 랜덤 값
    });
  }

  // 노드별 단일 시리즈 생성
  return [
    {
      metricName: "mock-metric",
      nodeName,
      prettyName: nodeName,
      modelName: nodeName,
      value: dataPoints.map((point) => ({
        ...point,
        value: (parseFloat(point.value) + Math.random() * 10).toFixed(1),
      })),
    },
  ];
}

/**
 * Network 멀티 시리즈 목 데이터 (network-rt: receive / transmit)
 */
export function generateMockNetworkRtMetricData(
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const basePoints: MetricDataPoint[] = [];

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    basePoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 40 + 40).toFixed(1),
    });
  }

  const makeSeries = (label: string, bias: number): ResourceMetricResponse => ({
    metricName: "network-rt",
    nodeName,
    prettyName: label, // series 키와 동일 (receive / transmit)
    value: basePoints.map((point) => ({
      ...point,
      value: (parseFloat(point.value) + bias).toFixed(1),
    })),
  });

  return [makeSeries("receive", 0), makeSeries("transmit", 10)];
}

/**
 * Disk 멀티 시리즈 목 데이터 (disk-rw: read / write)
 */
export function generateMockDiskRwMetricData(
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const basePoints: MetricDataPoint[] = [];

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    basePoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 20 + 10).toFixed(1),
    });
  }

  const makeSeries = (label: string, bias: number): ResourceMetricResponse => ({
    metricName: "disk-rw",
    nodeName,
    prettyName: label, // series 키와 동일 (read / write)
    value: basePoints.map((point) => ({
      ...point,
      value: (parseFloat(point.value) + bias).toFixed(1),
    })),
  });

  return [makeSeries("read", 0), makeSeries("write", 5)];
}

/**
 * Memory 상세 멀티 시리즈 목 데이터 (memory-detail)
 * buffers, cached, memory_total, memory_free
 */
export function generateMockMemoryDetailMetricData(
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const basePoints: MetricDataPoint[] = [];

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    basePoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 10 + 10).toFixed(1),
    });
  }

  const makeSeries = (label: string, bias: number): ResourceMetricResponse => ({
    metricName: "memory-detail",
    nodeName,
    prettyName: label, // series 키와 동일
    value: basePoints.map((point) => ({
      ...point,
      value: (parseFloat(point.value) + bias).toFixed(1),
    })),
  });

  return [
    makeSeries("buffers", 0),
    makeSeries("cached", 5),
    makeSeries("memory_total", 20),
    makeSeries("memory_free", -5),
  ];
}

/**
 * CPU load average 멀티 시리즈 목 데이터 (cpu-load-average: 1min / 5min / 15min)
 */
export function generateMockCpuLoadAverageMetricData(
  nodeName: string,
  hours: number = 24,
): ResourceMetricResponse[] {
  const now = new Date();
  const basePoints: MetricDataPoint[] = [];

  // 시간별 공통 베이스 포인트 생성
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    basePoints.push({
      dateTime: time.toISOString(),
      value: (Math.random() * 1.5 + 0.5).toFixed(2),
    });
  }

  const makeSeries = (label: string, bias: number): ResourceMetricResponse => ({
    metricName: "cpu-load-average",
    nodeName,
    prettyName: label, // series 키와 동일 (1min / 5min / 15min)
    value: basePoints.map((point) => ({
      ...point,
      value: (parseFloat(point.value) + bias).toFixed(2),
    })),
  });

  return [
    makeSeries("1min", 0),
    makeSeries("5min", 0.2),
    makeSeries("15min", 0.4),
  ];
}

/**
 * 노드별 Mock 요약 데이터 생성
 * - system-monitoring 서비스와 MSW 핸들러에서 공통으로 사용하는 유틸
 */
export function generateMockNodeSummary(
  nodeName: string,
): SystemResourcesSummaryResponse {
  // 노드별로 다른 IP 생성 (간단한 해싱)
  const nodeIndex = nodeName.charCodeAt(0) % 256;
  const mockIp = `10.61.3.${nodeIndex}`;

  // 노드별로 약간 다른 리소스 생성
  const baseGpuCount = 2;
  const gpuVariation = (nodeName.charCodeAt(0) % 3) + 1; // 1-3 추가
  const gpuCount = baseGpuCount + gpuVariation;

  return {
    nodeName,
    nodeIp: mockIp,
    resource: {
      cpuCore: 32,
      memoryByte: 67441545216, // ~62.8 GB
      gpuCount,
      diskByte: 536870912000, // ~500 GB
    },
    gpuName: Array.from(
      { length: gpuCount },
      (_, i) => `NVIDIA TITAN Xp-${i + 1}`,
    ),
  };
}
