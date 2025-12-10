/**
 * 차트 데이터에서 최소/최대값을 계산하는 유틸리티
 */

/** 최소/최대값 결과 타입 */
export interface MinMaxResult<T> {
  minValue: number;
  maxValue: number;
  minItem: T | undefined;
  maxItem: T | undefined;
  minIndex: number;
  maxIndex: number;
}

/**
 * 배열에서 최소/최대값 및 해당 아이템을 찾습니다.
 *
 * @param data - 분석할 데이터 배열
 * @param valueGetter - 각 아이템에서 숫자 값을 추출하는 함수
 * @returns 최소/최대값과 해당 아이템, 인덱스
 *
 * @example
 * const data = [{ x: '2024-01-01', y: 10 }, { x: '2024-01-02', y: 20 }];
 * const result = findMinMax(data, (d) => d.y);
 * // { minValue: 10, maxValue: 20, minItem: {...}, maxItem: {...}, minIndex: 0, maxIndex: 1 }
 */
export function findMinMax<T>(
  data: T[],
  valueGetter: (item: T) => number,
): MinMaxResult<T> {
  if (!data || data.length === 0) {
    return {
      minValue: 0,
      maxValue: 0,
      minItem: undefined,
      maxItem: undefined,
      minIndex: -1,
      maxIndex: -1,
    };
  }

  const values = data.map(valueGetter);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minIndex = values.indexOf(minValue);
  const maxIndex = values.indexOf(maxValue);

  return {
    minValue,
    maxValue,
    minItem: data[minIndex],
    maxItem: data[maxIndex],
    minIndex,
    maxIndex,
  };
}

/**
 * 여러 시리즈 데이터에서 각각의 최소/최대값을 계산합니다.
 *
 * @param seriesData - 시리즈 데이터 배열 (각 시리즈는 data 배열을 가짐)
 * @param valueGetter - 데이터 포인트에서 y값을 추출하는 함수
 * @returns 각 시리즈별 최소/최대 결과 배열
 */
export function findMinMaxForSeries<T, D>(
  seriesData: T[],
  dataGetter: (series: T) => D[],
  valueGetter: (item: D) => number,
): Array<MinMaxResult<D> & { seriesIndex: number }> {
  return seriesData.map((series, seriesIndex) => {
    const data = dataGetter(series);
    const result = findMinMax(data, valueGetter);
    return { ...result, seriesIndex };
  });
}
