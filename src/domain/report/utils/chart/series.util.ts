/**
 * 차트 시리즈 데이터 변환 유틸리티
 */
import type { ApexOptions } from "apexcharts";

import type { ChartDataSeries } from "@/shared/utils/chart.util";

/**
 * x 값을 타임스탬프 숫자로 변환합니다.
 *
 * @param x - 변환할 x 값 (문자열, 숫자, Date)
 * @returns 타임스탬프 숫자
 */
function toTimestamp(x: string | number | Date): number {
  if (typeof x === "string") return new Date(x).getTime();
  if (typeof x === "number") return x;
  return x.getTime();
}

/**
 * x 값을 Date 객체로 변환합니다.
 *
 * @param x - 변환할 x 값 (문자열, 숫자, Date)
 * @returns Date 객체
 */
function toDate(x: string | number | Date): Date {
  if (typeof x === "string") return new Date(x);
  if (x instanceof Date) return x;
  return new Date(x);
}

/** 원본 데이터 포인트 타입 */
export interface RawDataPoint {
  x: string | number | Date;
  y: number;
}

/** 원본 시리즈 데이터 타입 */
export interface RawSeriesData<T extends string = string> {
  type?: T;
  name?: string;
  data: RawDataPoint[];
}

/**
 * 원본 데이터를 ApexCharts 시리즈 형식으로 변환합니다.
 *
 * @param data - 원본 시리즈 데이터 배열
 * @param labelMap - 타입/이름을 라벨로 변환하는 맵 (선택)
 * @returns ApexCharts 시리즈 데이터
 *
 * @example
 * const series = convertToApexSeries(
 *   [{ type: 'BATCH', data: [...] }],
 *   { BATCH: 'Batch', INTERACTIVE: 'Interactive' }
 * );
 */
export function convertToApexSeries<T extends string>(
  data: RawSeriesData<T>[],
  labelMap?: Record<T, string>,
): ApexOptions["series"] {
  return data.map((item) => ({
    name: labelMap && item.type ? labelMap[item.type] : (item.name ?? ""),
    data: item.data.map((point) => ({
      x: toTimestamp(point.x),
      y: point.y,
    })),
  }));
}

/**
 * ChartLegendToggle 컴포넌트용 시리즈 데이터로 변환합니다.
 *
 * @param data - 원본 시리즈 데이터 배열
 * @param labelMap - 타입/이름을 라벨로 변환하는 맵 (선택)
 * @param chartType - 차트 타입 (line, bar, area)
 * @returns ChartLegendToggle용 시리즈 데이터
 *
 * @example
 * const legendSeries = convertToLegendSeries(
 *   gpuData,
 *   undefined,
 *   'line'
 * );
 */
export function convertToLegendSeries<T extends string>(
  data: RawSeriesData<T>[],
  labelMap?: Record<T, string>,
  chartType: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  return data.map((item) => ({
    type: chartType,
    name: labelMap && item.type ? labelMap[item.type] : (item.name ?? ""),
    data: item.data.map((point) => ({
      x: toDate(point.x),
      y: point.y,
    })),
  }));
}

/**
 * GpuSeries 형태의 데이터를 RawSeriesData 형태로 변환합니다.
 * (name 필드를 사용하는 시리즈 데이터용)
 *
 * @param data - name과 data를 가진 시리즈 배열
 * @returns RawSeriesData 형태의 배열
 */
export function normalizeNamedSeries(
  data: Array<{ name: string; data: RawDataPoint[] }>,
): RawSeriesData[] {
  return data.map((item) => ({
    name: item.name,
    data: item.data,
  }));
}
