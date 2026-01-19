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

// 워크스페이스 멤버 관련 엔드포인트
const WORKSPACE_MEMBER_BASE = "/core-api/v1/core/workspace/member";

export const WORKSPACE_MEMBER_ENDPOINTS = {
  // 워크스페이스 멤버 목록 API
  base: WORKSPACE_MEMBER_BASE,
} as const;

// 리소스 요청 관련 엔드포인트
const REQUEST_RESOURCE_BASE = "/core-api/v1/core/workspace/admin/resource";

export const REQUEST_RESOURCE_ENDPOINTS = {
  // 리소스 요청 목록 API
  base: REQUEST_RESOURCE_BASE,
} as const;

// 크리덴셜 관련 엔드포인트
const CREDENTIAL_BASE = "/core-api/v1/core/credential";

export const CREDENTIAL_ENDPOINTS = {
  // 크리덴셜 목록 API
  base: CREDENTIAL_BASE,
} as const;

// 계정 관리 관련 엔드포인트
const ACCOUNT_BASE = "/api/v1/admin/accounts";

export const ACCOUNT_ENDPOINTS = {
  // 계정 목록 API
  base: ACCOUNT_BASE,
} as const;
