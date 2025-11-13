import type { MonitoringMetricType } from "@/types/monitoring/monitoring.type";

/**
 * 모니터링 메트릭 타입과 정보를 한 번에 관리하는 매핑
 */
const METRIC_MAP: Record<MonitoringMetricType, Record<string, string>> = {
  "cpu-utilization": {
    text: "CPU 사용률",
    unit: "%",
    color: "#376DFF",
  },
  "cpu-usage": {
    text: "CPU 사용량",
    unit: "Core",
    color: "#376DFF",
  },
  "memory-usage": {
    text: "Memory 사용량",
    unit: "GB",
    color: "#55D398",
  },
  "memory-utilization": {
    text: "Memory 사용률",
    unit: "%",
    color: "#55D398",
  },
  "gpu-utilization": {
    text: "GPU 사용률",
    unit: "%",
    color: "#A353FF",
  },
  "gpu-memory": {
    text: "GPU 메모리 사용률",
    unit: "GB",
    color: "#A353FF",
  },
  "disk-utilization": {
    text: "Disk 사용률",
    unit: "%",
    color: "#FFD129",
  },
  "disk-usage": {
    text: "Disk 사용량",
    unit: "GB",
    color: "#FFD129",
  },
} as const;

/**
 * 모니터링 메트릭 타입 정보 조회
 * @param type - 모니터링 메트릭 타입
 * @returns 메트릭 정보 (제목, 단위, 색상)
 */
export function getMetricInfo(
  type: MonitoringMetricType,
): Record<string, string> {
  return METRIC_MAP[type];
}
