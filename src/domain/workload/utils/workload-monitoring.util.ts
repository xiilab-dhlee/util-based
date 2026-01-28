import { GPU_CHART_COLORS } from "@/domain/monitoring/utils/monitoring.util";
import type { MetricInfo } from "@/shared/types/metric-info.type";

/**
 * 워크로드 모니터링에서 사용하는 메트릭 타입
 */
export type WorkloadMonitoringMetricType =
  | "gpu-utilization"
  | "gpu-memory"
  | "cpu-usage"
  | "memory-usage";

/**
 * 워크로드 모니터링 전용 메트릭 정보
 * - 워크로드에서 사용하는 4개 메트릭만 정의
 * - 공통 monitoring.util.ts와 분리
 */
const WORKLOAD_METRIC_MAP: Record<WorkloadMonitoringMetricType, MetricInfo> = {
  "gpu-utilization": {
    text: "GPU 사용률",
    unit: "%",
    colors: GPU_CHART_COLORS,
  },
  "gpu-memory": {
    text: "GPU Memory 사용률",
    unit: "%",
    colors: GPU_CHART_COLORS,
  },
  "cpu-usage": {
    text: "CPU 사용률",
    unit: "%",
    colors: ["#376DFF"],
  },
  "memory-usage": {
    text: "Memory 사용률",
    unit: "%",
    colors: ["#55D398"],
  },
};

/**
 * 워크로드 모니터링 메트릭 타입 정보 조회
 * @param type - 워크로드 모니터링 메트릭 타입
 * @returns 워크로드 전용 메트릭 정보 (제목, 단위, 색상 배열)
 */
export function getWorkloadMetricInfo(
  type: WorkloadMonitoringMetricType,
): MetricInfo {
  return WORKLOAD_METRIC_MAP[type];
}
