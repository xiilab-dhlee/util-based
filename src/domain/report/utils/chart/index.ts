/**
 * 차트 유틸리티 모듈
 *
 * 리포트 도메인에서 사용되는 차트 관련 유틸리티 함수들을 제공합니다.
 */

// Annotation 생성 유틸리티
export {
  type AnnotationStyleOptions,
  createMinMaxAnnotations,
  createMinMaxAnnotationsForSeries,
  createPointAnnotation,
  type MinMaxAnnotationOptions,
  type SeriesWithData,
  type TimeSeriesDataPoint,
} from "@/domain/report/utils/chart/annotations.util";
// Min/Max 계산 유틸리티
export {
  findMinMax,
  findMinMaxForSeries,
  type MinMaxResult,
} from "@/domain/report/utils/chart/min-max.util";
// 시리즈 데이터 변환 유틸리티
export {
  convertToApexSeries,
  convertToLegendSeries,
  normalizeNamedSeries,
  type RawDataPoint,
  type RawSeriesData,
} from "@/domain/report/utils/chart/series.util";
