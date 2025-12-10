/**
 * ApexCharts Annotation 생성 유틸리티
 */
import type { ApexOptions } from "apexcharts";

import { findMinMax } from "@/domain/report/utils/chart/min-max.util";

/** Annotation 스타일 옵션 */
export interface AnnotationStyleOptions {
  /** 마커 크기 (기본값: 6) */
  markerSize?: number;
  /** 마커 테두리 색상 (기본값: #fff) */
  strokeColor?: string;
  /** 마커 테두리 두께 (기본값: 2) */
  strokeWidth?: number;
  /** 라벨 폰트 크기 (기본값: 10px) */
  fontSize?: string;
  /** 라벨 Y 오프셋 (기본값: -10) */
  offsetY?: number;
}

/** 포인트 Annotation 타입 */
type PointAnnotation = NonNullable<
  NonNullable<ApexOptions["annotations"]>["points"]
>[number];

/**
 * 단일 포인트 Annotation을 생성합니다.
 *
 * @param x - X축 값 (timestamp)
 * @param y - Y축 값
 * @param seriesIndex - 시리즈 인덱스
 * @param label - 표시할 라벨 텍스트
 * @param color - 색상
 * @param options - 스타일 옵션
 */
export function createPointAnnotation(
  x: number,
  y: number,
  seriesIndex: number,
  label: string,
  color: string,
  options: AnnotationStyleOptions = {},
): PointAnnotation {
  const {
    markerSize = 6,
    strokeColor = "#fff",
    strokeWidth = 2,
    fontSize = "10px",
    offsetY = -10,
  } = options;

  return {
    x,
    y,
    seriesIndex,
    marker: {
      size: markerSize,
      fillColor: color,
      strokeColor,
      strokeWidth,
    },
    label: {
      text: label,
      style: {
        color: "#fff",
        background: color,
        fontSize,
        padding: {
          left: 4,
          right: 4,
          top: 2,
          bottom: 2,
        },
      },
      offsetY,
    },
  };
}

/** Min/Max Annotation 생성 옵션 */
export interface MinMaxAnnotationOptions extends AnnotationStyleOptions {
  /** 단위 (예: %, GB, Core) */
  unit?: string;
  /** 최소값 라벨 포맷 (기본값: "최소 {value}{unit}") */
  minLabelFormat?: (value: number, unit: string) => string;
  /** 최대값 라벨 포맷 (기본값: "최대 {value}{unit}") */
  maxLabelFormat?: (value: number, unit: string) => string;
}

/**
 * 시계열 데이터 포인트 타입
 */
export interface TimeSeriesDataPoint {
  x: string | number | Date;
  y: number;
}

/**
 * 단일 시리즈에 대한 Min/Max Annotation을 생성합니다.
 *
 * @param data - 시계열 데이터 배열
 * @param seriesIndex - 시리즈 인덱스
 * @param color - 색상
 * @param options - 스타일 및 포맷 옵션
 */
export function createMinMaxAnnotationsForSeries(
  data: TimeSeriesDataPoint[],
  seriesIndex: number,
  color: string,
  options: MinMaxAnnotationOptions = {},
): PointAnnotation[] {
  const {
    unit = "%",
    minLabelFormat = (v, u) => `최소 ${v}${u}`,
    maxLabelFormat = (v, u) => `최대 ${v}${u}`,
    ...styleOptions
  } = options;

  const result = findMinMax(data, (d) => d.y);
  const annotations: PointAnnotation[] = [];

  // 최소값 annotation
  if (result.minItem) {
    const x =
      typeof result.minItem.x === "string"
        ? new Date(result.minItem.x).getTime()
        : typeof result.minItem.x === "number"
          ? result.minItem.x
          : result.minItem.x.getTime();

    annotations.push(
      createPointAnnotation(
        x,
        result.minValue,
        seriesIndex,
        minLabelFormat(result.minValue, unit),
        color,
        styleOptions,
      ),
    );
  }

  // 최대값 annotation
  if (result.maxItem) {
    const x =
      typeof result.maxItem.x === "string"
        ? new Date(result.maxItem.x).getTime()
        : typeof result.maxItem.x === "number"
          ? result.maxItem.x
          : result.maxItem.x.getTime();

    annotations.push(
      createPointAnnotation(
        x,
        result.maxValue,
        seriesIndex,
        maxLabelFormat(result.maxValue, unit),
        color,
        styleOptions,
      ),
    );
  }

  return annotations;
}

/** 시리즈 데이터 타입 (name과 data를 가진 객체) */
export interface SeriesWithData<
  T extends TimeSeriesDataPoint = TimeSeriesDataPoint,
> {
  name?: string;
  data: T[];
}

/**
 * 여러 시리즈에 대한 Min/Max Annotations를 생성합니다.
 *
 * @param seriesData - 시리즈 데이터 배열
 * @param colors - 시리즈별 색상 배열
 * @param options - 스타일 및 포맷 옵션
 * @returns ApexCharts annotations 옵션
 *
 * @example
 * const annotations = createMinMaxAnnotations(
 *   [{ name: 'GPU-0', data: [...] }, { name: 'GPU-1', data: [...] }],
 *   ['#A353FF', '#5398FF'],
 *   { unit: '%' }
 * );
 */
export function createMinMaxAnnotations<T extends TimeSeriesDataPoint>(
  seriesData: SeriesWithData<T>[],
  colors: readonly string[],
  options: MinMaxAnnotationOptions = {},
): ApexOptions["annotations"] {
  if (!seriesData || seriesData.length === 0) {
    return { points: [] };
  }

  const allAnnotations: PointAnnotation[] = [];

  seriesData.forEach((series, index) => {
    const color = colors[index % colors.length];
    const annotations = createMinMaxAnnotationsForSeries(
      series.data,
      index,
      color,
      options,
    );
    allAnnotations.push(...annotations);
  });

  return { points: allAnnotations };
}
