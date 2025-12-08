import type { Page } from "@playwright/test";

import { workloadListMock } from "../../../src/mocks/data/workload.mock";
import { type ApiMock, paginatedResponse } from "./types";

/**
 * 워크로드 도메인 API 모킹
 */

const testWorkloadListMock: ApiMock = {
  pattern: "**/core-api/v1/core/workload/**",
  handler: (route) => {
    paginatedResponse(route, workloadListMock);
  },
};

/**
 * 워크로드 도메인의 모든 API Mock 목록
 */
export const workloadMocks: ApiMock[] = [testWorkloadListMock];

/**
 * 워크로드 도메인 모킹 설정
 */
export async function setupWorkloadMocks(page: Page) {
  for (const mock of workloadMocks) {
    await page.route(mock.pattern, mock.handler);
  }
}
