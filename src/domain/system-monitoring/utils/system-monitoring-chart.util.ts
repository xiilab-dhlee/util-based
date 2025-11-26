import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import type { ResourceMetricResponse } from "@/domain/system-monitoring/types/system-monitoring.type";
import type { ChartDataSeries } from "@/shared/utils/chart.util";

const isGpuMetricType = (metricType: MonitoringMetricType): boolean => {
  return metricType.startsWith("gpu-");
};

/**
 * 시스템 모니터링 API 응답을 ApexCharts 형식으로 변환
 *
 * @param data - API 응답 배열
 * @param type - 차트 타입 (line/bar/area)
 * @returns ApexCharts 시리즈 데이터 배열
 */
export function mapResourceMetricsToChartData(
  data: ResourceMetricResponse[],
  type: "line" | "bar" | "area" = "area",
): ChartDataSeries[] {
  if (!data || data.length === 0) {
    return [];
  }

  return data.map((metric) => ({
    type,
    // 표시명 우선순위: prettyName > modelName > nodeName
    name: metric.prettyName || metric.modelName || metric.nodeName,
    data: metric.value
      .filter((point) => !Number.isNaN(parseFloat(point.value)))
      .map((point) => ({
        x: new Date(point.dateTime),
        y: parseFloat(point.value),
      })),
  }));
}

/**
 * 시스템 모니터링 전용 차트 데이터 변환 유틸
 *
 * 요구사항:
 * - GPU 메트릭: GPU 장치별 멀티 시리즈 유지
 *   - legend/tooltip 시리즈 이름은 GPU 이름(prettyName / modelName) 기준
 * - GPU 이외 메트릭:
 *   - 기본: METRIC_MAP의 text를 단일 시리즈 이름으로 사용
 *   - 멀티 시리즈 메트릭(memory-detail, network-rt, disk-rw 등):
 *     - METRIC_MAP의 series 배열을 기준으로 시리즈를 구성
 *     - legend/tooltip 시리즈 이름은 해당 series 값(receive, transmit 등)을 사용
 */
export function mapSystemResourceMetricsToChartData(
  metricType: MonitoringMetricType,
  data: ResourceMetricResponse[],
  type: "line" | "bar" | "area" = "area",
): ChartDataSeries[] {
  if (!data || data.length === 0) {
    return [];
  }

  // GPU 메트릭은 GPU 장치별 멀티 시리즈 규칙을 그대로 사용
  if (isGpuMetricType(metricType)) {
    return mapResourceMetricsToChartData(data, type);
  }

  const metricInfo = getMetricInfo(metricType);
  const seriesKeys = metricInfo.series;

  // 멀티 시리즈 메트릭(memory-detail, network-rt, disk-rw 등)
  if (seriesKeys && seriesKeys.length > 0) {
    const result: ChartDataSeries[] = [];

    seriesKeys.forEach((seriesKey) => {
      // 백엔드에서 내려주는 시리즈별 메트릭을 찾는다.
      // - prettyName / instance / metricName 중 하나에 seriesKey가 들어있다고 가정
      const seriesMetric = data.find((metric) => {
        const label = metric.prettyName || metric.instance || metric.metricName;
        return label?.toLowerCase().trim() === seriesKey.toLowerCase().trim();
      });

      // 대응되는 메트릭이 없으면 해당 시리즈는 스킵
      if (!seriesMetric) return;

      result.push({
        type,
        // legend/tooltip 시리즈 이름은 상세 시리즈 값(ex: receive, transmit)
        name: seriesKey,
        data: seriesMetric.value
          .filter((point) => !Number.isNaN(parseFloat(point.value)))
          .map((point) => ({
            x: new Date(point.dateTime),
            y: parseFloat(point.value),
          })),
      });
    });

    // 하나 이상 매핑된 경우 멀티 시리즈로 반환
    if (result.length > 0) {
      return result;
    }
    // series 정의는 있지만 백엔드 데이터 구조가 다를 경우, 아래 단일 시리즈 규칙으로 폴백
  }

  // 단일 시스템 메트릭(CPU, memory-utilization, disk-utilization 등)
  // - 노드 기준 멀티가 아니라, "해당 노드의 단일 시스템 메트릭"으로 본다.
  const primaryMetric = data[0];
  if (!primaryMetric) {
    return [];
  }

  return [
    {
      type,
      // legend/tooltip 시리즈 이름은 METRIC_MAP의 text
      name: metricInfo.text,
      data: primaryMetric.value
        .filter((point) => !Number.isNaN(parseFloat(point.value)))
        .map((point) => ({
          x: new Date(point.dateTime),
          y: parseFloat(point.value),
        })),
    },
  ];
}
