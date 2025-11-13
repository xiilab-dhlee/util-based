/**
 * 리소스 단위 상수 정의
 */

/**
 * 리소스 타입별 단위 정보
 */
export const RESOURCE_UNITS = {
  /** GPU 단위 */
  gpu: "개",
  /** CPU 단위 */
  cpu: "Core",
  /** Memory 단위 */
  memory: "GB",
} as const;

/**
 * 리소스 타입 정의
 */
export type ResourceType = keyof typeof RESOURCE_UNITS;

/**
 * 단위 값 타입
 */
export type ResourceUnit = (typeof RESOURCE_UNITS)[ResourceType];
