import { groupBy, maxBy } from "es-toolkit";

import type {
  ModelMetricData,
  TimeGroupedResourceMetricsResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  WORKSPACE_METRIC_TYPE,
  type WorkspaceMetricType,
} from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import type { MetricExtractionResult } from "@/domain/user-monitoring/types/workspace-metrics.type";
import { getWorkspaceMetricText } from "@/domain/user-monitoring/utils/workspace-monitoring.util";
import type { ChartDataSeries } from "@/shared/utils/chart.util";
import { convertBytes } from "@/shared/utils/resource.util";

function extractSingleValue(data: ModelMetricData[]): number {
  const firstValue = data[0]?.value;

  if (firstValue === undefined || firstValue === null) {
    return NaN;
  }

  const numericValue = parseFloat(firstValue);
  return numericValue;
}

function convertMemoryToGB(bytes: number): number {
  return convertBytes(bytes, "GB").value;
}

function transformGpuToChartSeries(
  apiData: TimeGroupedResourceMetricsResponse[],
): ChartDataSeries[] {
  const allDataPoints = apiData.flatMap((item) =>
    item.data.map((modelData) => ({
      modelName: modelData.modelName || "GPU",
      dateTime: item.dateTime,
      value: parseFloat(modelData.value),
    })),
  );

  const validDataPoints = allDataPoints.filter(
    (point) => !Number.isNaN(point.value),
  );

  const groupedByModel = groupBy(validDataPoints, (point) => point.modelName);

  return Object.entries(groupedByModel).map(([modelName, points]) => ({
    type: "area" as const,
    name: modelName,
    data: points.map((point) => ({
      x: new Date(point.dateTime),
      y: point.value,
    })),
  }));
}

export function transformToChartSeries(
  apiData: TimeGroupedResourceMetricsResponse[],
  metricType: WorkspaceMetricType,
): ChartDataSeries {
  const chartData = apiData
    .map((item) => {
      const rawValue = extractSingleValue(item.data);
      const value =
        metricType === WORKSPACE_METRIC_TYPE.MEM
          ? convertMemoryToGB(rawValue)
          : rawValue;

      return {
        x: new Date(item.dateTime),
        y: value,
      };
    })
    .filter((point) => !Number.isNaN(point.y));

  return {
    type: "area",
    name: getWorkspaceMetricText(metricType),
    data: chartData,
  };
}

export function extractWorkspaceMetric(
  data: TimeGroupedResourceMetricsResponse[] | undefined,
  metricType: WorkspaceMetricType,
): MetricExtractionResult {
  if (!data || data.length === 0) {
    return { status: "empty", data: [] };
  }

  try {
    const seriesData =
      metricType === WORKSPACE_METRIC_TYPE.GPU
        ? transformGpuToChartSeries(data)
        : [transformToChartSeries(data, metricType)];

    return { status: "success", data: seriesData };
  } catch (error) {
    return {
      status: "error",
      data: [],
      error: error instanceof Error ? error.message : "Transformation error",
    };
  }
}

export function getLastTimestamp(data: ChartDataSeries[]): string | null {
  const allTimestamps = data
    .flatMap((series) => series.data)
    .map((point) => point.x)
    .filter((x): x is Date => x instanceof Date && !Number.isNaN(x.getTime()));

  const latestTimestamp = maxBy(allTimestamps, (date) => date.getTime());

  return latestTimestamp?.toISOString() ?? null;
}
