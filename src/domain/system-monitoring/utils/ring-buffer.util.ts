/**
 * 함수형 링 버퍼 유틸
 *
 * 최근 N개의 데이터를 유지하는 FIFO 버퍼
 * - 메모리 상한 제어
 * - 불변 객체 기반
 */

export interface RingBufferState<T> {
  data: T[];
  maxSize: number;
}

/**
 * 링 버퍼 생성
 * @param maxSize - 최대 크기 (기본: 5000)
 */
export function createRingBuffer<T>(
  maxSize: number = 5000,
): RingBufferState<T> {
  return {
    data: [],
    maxSize: Math.max(1, maxSize),
  };
}

/**
 * 링 버퍼에 항목 추가
 * @param buffer - 현재 버퍼 상태
 * @param items - 추가할 항목 (단일 또는 배열)
 * @returns 새로운 버퍼 상태 (불변)
 *
 * @note
 * - 버퍼가 꽉 차면 가장 오래된 항목부터 제거 (FIFO)
 * - O(n) shift 비용이 있으나 일반적인 사용에는 무시할 수 있는 수준
 * - 최적화 필요 시: startIndex 기반 실제 링 버퍼로 교체 가능
 */
export function pushToRingBuffer<T>(
  buffer: RingBufferState<T>,
  items: T | T[],
): RingBufferState<T> {
  const itemsArray = Array.isArray(items) ? items : [items];
  const newData = [...buffer.data];

  for (const item of itemsArray) {
    if (newData.length >= buffer.maxSize) {
      newData.shift();
    }
    newData.push(item);
  }

  return {
    ...buffer,
    data: newData,
  };
}

/**
 * 링 버퍼 초기화
 * @param buffer - 버퍼 상태
 * @returns 빈 버퍼 상태
 */
export function clearRingBuffer<T>(
  buffer: RingBufferState<T>,
): RingBufferState<T> {
  return {
    ...buffer,
    data: [],
  };
}

/**
 * 버퍼 크기 계산
 *
 * 공식: (표시 시간 범위 / 샘플링 주기) × 여유 계수
 *
 * @param viewportMinutes - 표시 시간 범위 (분, 기본: 10)
 * @param samplingIntervalSeconds - 샘플링 간격 (초, 기본: 5)
 * @param safetyMargin - 여유 계수 (기본: 1.2)
 * @returns 계산된 버퍼 크기 (최대 5000)
 *
 * @example
 * calculateBufferSize(10, 5, 1.2)
 * // → (10*60 / 5) * 1.2 = 144
 */
export function calculateBufferSize(
  viewportMinutes: number = 10,
  samplingIntervalSeconds: number = 5,
  safetyMargin: number = 1.2,
): number {
  const baseSize =
    ((viewportMinutes * 60) / samplingIntervalSeconds) * safetyMargin;
  const maxBufferSize = 5000;
  return Math.min(Math.ceil(baseSize), maxBufferSize);
}
