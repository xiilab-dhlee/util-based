import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";
import { setupAllMocks } from "../../support/mocks";

/**
 * 인증 Step Definitions
 *
 * 사용자 인증 관련 Step 정의
 */

const { Given } = createBdd(test);

/**
 * 사용자 인증 Step
 *
 * globalSetup에서 storageState로 인증 상태가 저장되어 있고,
 * playwright.config.ts에서 자동으로 로드됩니다.
 *
 * testMode에 따라 동작:
 * - mock: API Mock 설정 수행
 * - integration: 실제 API 사용 (Mock 설정 없음)
 *
 * 인증 쿠키는 Playwright가 자동으로 관리합니다.
 */
Given("사용자가 로그인되어 있다", async ({ page, testMode }) => {
  if (testMode === "mock") {
    await setupAllMocks(page);
  }
  // integration 모드에서는 실제 API 사용
});
