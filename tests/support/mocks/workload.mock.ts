import type { Page } from "@playwright/test";

import {
  activeWorkloadListMock,
  disabledWorkloadListMock,
} from "../../../src/mocks/data/workload.mock";
import { type ApiMock, paginatedResponse } from "./types";

/**
 * 워크로드 도메인 API 모킹
 */

const testActiveWorkloadListMock: ApiMock = {
  pattern: "**/core-api/v1/core/workload/active",
  handler: (route) => {
    paginatedResponse(route, activeWorkloadListMock);
  },
};

const testDisabledWorkloadListMock: ApiMock = {
  pattern: "**/core-api/v1/core/workload/disabled",
  handler: (route) => {
    paginatedResponse(route, disabledWorkloadListMock);
  },
};

/**
 * 워크로드 도메인의 모든 API Mock 목록
 */
export const workloadMocks: ApiMock[] = [
  testActiveWorkloadListMock,
  testDisabledWorkloadListMock,
];

/**
 * 워크로드 도메인 모킹 설정
 */
export async function setupWorkloadMocks(page: Page) {
  for (const mock of workloadMocks) {
    await page.route(mock.pattern, mock.handler);
  }
}
