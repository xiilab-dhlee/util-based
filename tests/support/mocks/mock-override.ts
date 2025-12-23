import type { Page, Route } from "@playwright/test";

/**
 * Mock Override Helper
 *
 * setupAllMocks 이후에 특정 API 응답을 오버라이드하기 위한 헬퍼 함수들입니다.
 * 주로 edge-case 테스트(API 에러, 빈 목록 등)에 사용됩니다.
 *
 * Playwright는 마지막에 등록된 route가 먼저 실행됩니다.
 * 따라서 새로운 route를 등록하면 기존 route보다 먼저 실행됩니다.
 *
 * 참고: https://playwright.dev/docs/api/class-route
 *
 * @example
 * import { WORKLOAD_ENDPOINTS } from "@/shared/constants/endpoint.constant";
 *
 * // 500 에러 모킹
 * await mockApiError(page, WORKLOAD_ENDPOINTS.active);
 *
 * // 빈 목록 모킹
 * await mockEmptyList(page, WORKLOAD_ENDPOINTS.base);
 */

// ============================================
// Types
// ============================================

/** 커스텀 응답 옵션 */
interface CustomResponseOptions {
  /** HTTP 상태 코드 */
  status?: number;
  /** 응답 본문 */
  body?: unknown;
  /** Content-Type (기본값: application/json) */
  contentType?: string;
}

// ============================================
// Helper Functions
// ============================================

/**
 * 엔드포인트를 Playwright glob 패턴으로 변환
 */
function toGlobPattern(endpoint: string): string {
  return `**${endpoint}*`;
}

/**
 * 기본 500 에러 응답 생성
 */
function createErrorResponse() {
  return {
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({
      message: "Internal Server Error",
      statusCode: 500,
    }),
  };
}

/**
 * 기본 빈 목록 응답 생성
 */
function createEmptyResponse() {
  return {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ content: [], totalSize: 0 }),
  };
}

// ============================================
// Public API
// ============================================

/**
 * API 500 에러 응답 모킹
 *
 * 지정된 API 엔드포인트가 500 에러를 반환하도록 설정합니다.
 *
 * @param page - Playwright Page 객체
 * @param endpoint - API 엔드포인트 경로 (예: WORKLOAD_ENDPOINTS.active)
 *
 * @example
 * await mockApiError(page, WORKLOAD_ENDPOINTS.active);
 */
export async function mockApiError(
  page: Page,
  endpoint: string,
): Promise<void> {
  const response = createErrorResponse();
  const pattern = toGlobPattern(endpoint);

  await page.route(pattern, (route: Route) => {
    route.fulfill(response);
  });
}

/**
 * 빈 목록 응답 모킹
 *
 * 지정된 API 엔드포인트가 빈 목록을 반환하도록 설정합니다.
 *
 * @param page - Playwright Page 객체
 * @param endpoint - API 엔드포인트 경로 (예: WORKLOAD_ENDPOINTS.base)
 *
 * @example
 * await mockEmptyList(page, WORKLOAD_ENDPOINTS.base);
 */
export async function mockEmptyList(
  page: Page,
  endpoint: string,
): Promise<void> {
  const response = createEmptyResponse();
  const pattern = toGlobPattern(endpoint);

  await page.route(pattern, (route: Route) => {
    route.fulfill(response);
  });
}

/**
 * 커스텀 응답 모킹
 *
 * 지정된 API 엔드포인트가 커스텀 응답을 반환하도록 설정합니다.
 *
 * @param page - Playwright Page 객체
 * @param endpoint - API 엔드포인트 경로
 * @param options - 커스텀 응답 옵션
 *
 * @example
 * await mockCustomResponse(page, WORKLOAD_ENDPOINTS.active, {
 *   status: 403,
 *   body: { message: "Forbidden" }
 * });
 */
export async function mockCustomResponse(
  page: Page,
  endpoint: string,
  options: CustomResponseOptions,
): Promise<void> {
  const response = {
    status: options.status ?? 200,
    contentType: options.contentType ?? "application/json",
    body:
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body),
  };
  const pattern = toGlobPattern(endpoint);

  await page.route(pattern, (route: Route) => {
    route.fulfill(response);
  });
}
