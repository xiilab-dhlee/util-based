import type {
  BatchWorkloadMetricsResponse,
  GetWorkloadResourceMetricsTimeseriesMetricsItem,
  WorkloadMetricResult,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  METRIC_EXTRACT_STATUS,
  type MetricExtractStatus,
} from "@/domain/workload/constants/workload-monitoring.constant";
import type { MetricValue } from "@/domain/workload/types/workload-metrics.type";

/**
 * 메트릭 타입을 한글 이름으로 변환
 */
export function toSeriesName(
  metricName: GetWorkloadResourceMetricsTimeseriesMetricsItem,
): string {
  const nameMap: Partial<
    Record<GetWorkloadResourceMetricsTimeseriesMetricsItem, string>
  > = {
    GPU_UTILIZATION: "GPU 사용률",
    GPU_MEM_UTILIZATION: "GPU 메모리 사용률",
    CPU_UTILIZATION: "CPU 사용률",
    MEM_UTILIZATION: "메모리 사용률",
  };

  return nameMap[metricName] ?? metricName;
}

/**
 * 메트릭 키 타입 (API 응답 구조)
 */
type MetricKey =
  | "gpuUtilization"
  | "gpuMemUtilization"
  | "cpuUtilization"
  | "memUtilization";

/**
 * 메트릭 타입을 API 응답 키로 변환
 */
function metricTypeToKey(
  metricType: GetWorkloadResourceMetricsTimeseriesMetricsItem,
): MetricKey | undefined {
  const keyMap: Partial<
    Record<GetWorkloadResourceMetricsTimeseriesMetricsItem, MetricKey>
  > = {
    GPU_UTILIZATION: "gpuUtilization",
    GPU_MEM_UTILIZATION: "gpuMemUtilization",
    CPU_UTILIZATION: "cpuUtilization",
    MEM_UTILIZATION: "memUtilization",
  };

  return keyMap[metricType];
}

function convertMetricResult(
  metricResult: WorkloadMetricResult | undefined,
): MetricValue[] {
  if (!metricResult || !metricResult.success || !metricResult.values) {
    return [];
  }

  return metricResult.values.flatMap((timePoint) => {
    if (!timePoint.data || !Array.isArray(timePoint.data)) {
      return [];
    }

    return timePoint.data.map((item) => ({
      dateTime: timePoint.dateTime,
      value: item.value,
      podName: item.podName,
      gpuIndex: item.gpuIndex,
      modelName: item.modelName,
    }));
  });
}

/**
 * BatchWorkloadMetricsResponse에서 특정 메트릭 데이터 추출
 *
 * @param response API 응답 (undefined 가능)
 * @param metricType 추출할 메트릭 타입
 * @returns { status, data } - status는 성공/실패/데이터없음, data는 변환된 메트릭 값 배열
 */
export function extractWorkloadMetricData(
  response: BatchWorkloadMetricsResponse | undefined,
  metricType: GetWorkloadResourceMetricsTimeseriesMetricsItem,
): {
  status: MetricExtractStatus;
  data: MetricValue[];
} {
  // 응답이 없는 경우
  if (!response) {
    return {
      status: METRIC_EXTRACT_STATUS.NO_DATA,
      data: [],
    };
  }

  const metricKey = metricTypeToKey(metricType);

  // 지원하지 않는 메트릭 타입
  if (!metricKey) {
    return {
      status: METRIC_EXTRACT_STATUS.NO_DATA,
      data: [],
    };
  }

  const metricResult = response[metricKey];

  // 메트릭 결과가 없는 경우
  if (!metricResult) {
    return {
      status: METRIC_EXTRACT_STATUS.NO_DATA,
      data: [],
    };
  }

  // 메트릭 조회 실패
  if (!metricResult.success) {
    return {
      status: METRIC_EXTRACT_STATUS.FAILED,
      data: [],
    };
  }

  // 성공했지만 데이터가 없는 경우
  const data = convertMetricResult(metricResult);
  if (data.length === 0) {
    return {
      status: METRIC_EXTRACT_STATUS.NO_DATA,
      data: [],
    };
  }

  // 정상 데이터 반환
  return {
    status: METRIC_EXTRACT_STATUS.SUCCESS,
    data,
  };
}
