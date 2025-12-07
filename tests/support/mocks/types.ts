import type { Route } from "@playwright/test";

/**
 * Route 핸들러 함수 타입
 */
export type RouteHandler = (route: Route) => void | Promise<void>;

/**
 * API Mock 정의
 * - pattern: URL 매칭 패턴 (glob 형식)
 * - handler: Route 핸들러 함수
 */
export interface ApiMock {
  pattern: string;
  handler: RouteHandler;
}

/**
 * 페이지네이션 응답 헬퍼
 */
export function paginatedResponse<T>(
  route: Route,
  content: T[],
  totalSize?: number,
) {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      content,
      totalSize: totalSize ?? content.length,
    }),
  });
}
