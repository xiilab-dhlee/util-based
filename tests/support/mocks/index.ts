import type { Page } from "@playwright/test";

import { combinedHandlers } from "../../../src/mocks/handlers";
import { setupMswHandlers } from "./msw-converter";

/**
 * 모든 API 모킹을 한 번에 설정
 *
 * MSW의 combinedHandlers를 Playwright Route로 변환하여 등록합니다.
 * 인증 Hook에서 페이지 이동 전에 호출되어야 합니다.
 *
 * @param page - Playwright Page 객체
 */
export async function setupAllMocks(page: Page): Promise<void> {
  await setupMswHandlers(page, combinedHandlers);
}
