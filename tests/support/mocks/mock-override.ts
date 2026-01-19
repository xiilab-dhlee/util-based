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
 *
 * 쿼리 파라미터가 있는 URL도 매칭하기 위해 끝에 *를 추가합니다.
 * 정확한 경로 매칭은 route 핸들러 내부에서 수행합니다.
 *
 * @param endpoint - 매칭할 API 엔드포인트 경로
 * @returns glob 패턴 문자열
 */
function toGlobPattern(endpoint: string): string {
  return `**${endpoint}*`;
}

/**
 * Route 핸들러 생성 - 정확한 경로 매칭 후 응답 반환
 *
 * glob 패턴은 느슨하게 매칭하고, 핸들러 내부에서 pathname을 정확히 검증합니다.
 * 이를 통해 /workload와 /workload/active를 구분합니다.
 *
 * @param endpoint - 정확히 매칭할 API 엔드포인트 경로
 * @param response - 반환할 응답 객체
 * @returns Route 핸들러 함수
 */
function createExactPathHandler(
  endpoint: string,
  response: { status: number; contentType: string; body: string },
): (route: Route) => Promise<void> {
  return async (route: Route) => {
    const url = new URL(route.request().url());

    // pathname이 정확히 일치하는 경우에만 응답 반환
    if (url.pathname === endpoint) {
      await route.fulfill(response);
    } else {
      // 일치하지 않으면 다음 핸들러로 전달
      await route.fallback();
    }
  };
}

/**
 * 기본 500 에러 응답 생성
 *
 * BaseResponse 형식에 맞춰 에러 응답을 생성합니다.
 */
function createErrorResponse() {
  return {
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({
      status: "FAIL",
      message: "Internal Server Error",
      timestamp: Date.now(),
    }),
  };
}

/**
 * 기본 빈 목록 응답 생성
 *
 * BaseResponse 형식에 맞춰 빈 목록 응답을 생성합니다.
 * data 필드 안에 content와 totalSize를 포함합니다.
 */
function createEmptyResponse() {
  return {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      status: "SUCCESS",
      data: {
        content: [],
        totalSize: 0,
        totalPageNum: 0,
        currentPageNo: 1,
      },
      message: "Success",
      timestamp: Date.now(),
    }),
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
  const handler = createExactPathHandler(endpoint, response);

  await page.route(pattern, handler);
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
  const handler = createExactPathHandler(endpoint, response);

  await page.route(pattern, handler);
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
  const handler = createExactPathHandler(endpoint, response);

  await page.route(pattern, handler);
}
