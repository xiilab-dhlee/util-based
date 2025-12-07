import type { Page } from "@playwright/test";

import { workspaceListMock } from "../../../src/mocks/data/workspace.mock";
import { type ApiMock, paginatedResponse } from "./types";

/**
 * 워크스페이스 도메인 API 모킹
 */

const testWorkspaceListMock: ApiMock = {
  pattern: "**/core-api/v1/core/workspace",
  handler: (route) => {
    paginatedResponse(route, workspaceListMock);
  },
};

/**
 * 워크스페이스 도메인의 모든 API Mock 목록
 */
export const workspaceMocks: ApiMock[] = [testWorkspaceListMock];

/**
 * 워크스페이스 도메인 모킹 설정
 */
export async function setupWorkspaceMocks(page: Page) {
  for (const mock of workspaceMocks) {
    await page.route(mock.pattern, mock.handler);
  }
}
