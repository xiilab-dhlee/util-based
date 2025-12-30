import type { Page } from "@playwright/test";

import { combinedHandlers } from "@/mocks/handlers";
import {
  type SetupMswHandlersOptions,
  setupMswHandlers,
} from "./msw-converter";

/** 이미 모킹 설정된 페이지 추적 (WeakSet으로 메모리 누수 방지) */
const mockedPages = new WeakSet<Page>();

/**
 * Mock 설정 옵션
 */
export type SetupAllMocksOptions = Pick<SetupMswHandlersOptions, "delay">;

/**
 * 환경변수에서 Mock 지연 시간 읽기
 *
 * @returns MOCK_DELAY 환경변수 값 (ms), 없으면 0
 */
function getMockDelayFromEnv(): number {
  const delay = parseInt(process.env.MOCK_DELAY ?? "0", 10);
  return Number.isNaN(delay) ? 0 : delay;
}

/**
 * 모든 API 모킹을 한 번에 설정
 *
 * MSW의 combinedHandlers를 Playwright Route로 변환하여 등록합니다.
 * 인증 Hook에서 페이지 이동 전에 호출되어야 합니다.
 *
 * 중복 호출 시 자동으로 스킵됩니다.
 *
 * @param page - Playwright Page 객체
 * @param options - Mock 설정 옵션
 *
 * @example
 * // 기본 사용 (지연 없음)
 * await setupAllMocks(page);
 *
 * // 코드에서 5초 지연 설정
 * await setupAllMocks(page, { delay: 5000 });
 *
 * // 환경변수로 지연 설정
 * // MOCK_DELAY=5000 pnpm test:smoke
 */
export async function setupAllMocks(
  page: Page,
  options: SetupAllMocksOptions = {},
): Promise<void> {
  // 이미 설정된 페이지는 스킵 (중복 호출 방지)
  if (mockedPages.has(page)) {
    return;
  }

  // 옵션 > 환경변수 순으로 지연 시간 결정
  const delay = options.delay ?? getMockDelayFromEnv();

  if (delay > 0) {
    console.log(`  🐢 Lazy Mock 모드 활성화: ${delay}ms 지연`);
  }

  await setupMswHandlers(page, combinedHandlers, { delay });
  mockedPages.add(page);
}
