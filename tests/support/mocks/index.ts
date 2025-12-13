import type { Page } from "@playwright/test";

import { combinedHandlers } from "../../../src/mocks/handlers";
import { setupMswHandlers } from "./msw-converter";

/** 이미 모킹 설정된 페이지 추적 (WeakSet으로 메모리 누수 방지) */
const mockedPages = new WeakSet<Page>();

/**
 * 모든 API 모킹을 한 번에 설정
 *
 * MSW의 combinedHandlers를 Playwright Route로 변환하여 등록합니다.
 * 인증 Hook에서 페이지 이동 전에 호출되어야 합니다.
 *
 * 중복 호출 시 자동으로 스킵됩니다.
 *
 * @param page - Playwright Page 객체
 */
export async function setupAllMocks(page: Page): Promise<void> {
  // 이미 설정된 페이지는 스킵 (중복 호출 방지)
  if (mockedPages.has(page)) {
    return;
  }

  await setupMswHandlers(page, combinedHandlers);
  mockedPages.add(page);
}
