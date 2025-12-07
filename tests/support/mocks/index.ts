import type { Page } from "@playwright/test";

import { setupWorkloadMocks } from "./workload.mock";
import { setupWorkspaceMocks } from "./workspace.mock";

/**
 * 테스트용 API 모킹 중앙 관리
 *
 * 도메인별로 분리된 모킹 설정을 조합하여 페이지별 모킹 설정 제공
 *
 * @example 새 도메인 추가 시
 * 1. mocks/[domain].mock.ts 파일 생성
 * 2. ApiMock[] 배열과 setup 함수 export
 * 3. 이 파일에서 import 후 페이지 설정에 추가
 */

// 타입 re-export
export type { ApiMock, RouteHandler } from "./types";
export { paginatedResponse } from "./types";

/**
 * 워크로드 페이지에 필요한 모든 API 모킹 설정
 */
export async function setupWorkloadPageMocks(page: Page) {
  await setupWorkloadMocks(page);
  await setupWorkspaceMocks(page);
}

/**
 * 모니터링 페이지에 필요한 API 모킹 설정
 */
export async function setupMonitoringPageMocks(page: Page) {
  await setupWorkspaceMocks(page);
}
