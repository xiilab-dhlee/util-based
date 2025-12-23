/**
 * API 엔드포인트 상수 정의
 * API 엔드포인트들을 중앙에서 관리합니다.
 */

// 워크로드 관련 엔드포인트
const WORKLOAD_BASE = "/core-api/v1/core/workload";

export const WORKLOAD_ENDPOINTS = {
  // 일반 워크로드 목록 API (비활성화 등)
  base: WORKLOAD_BASE,
  // 활성화 워크로드 목록 API
  active: `${WORKLOAD_BASE}/active`,
} as const;
