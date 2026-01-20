import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 설정 페이지 Step Definitions
 *
 * 사용자 설정 페이지 진입 관련 Step 정의
 * - 설정 페이지 이동
 * - 크리덴셜 관련 UI 요소 확인
 */

const { Given, Then } = createBdd(test);

// ============================================
// Background Steps - 설정 페이지 진입
// ============================================

Given("사용자 설정 페이지에 있다", async ({ settingPage }) => {
  await settingPage.goto();
});

// ============================================
// Then - 설정 페이지 UI 확인
// ============================================

Then("크리덴셜 추가 버튼이 표시된다", async ({ settingPage }) => {
  await settingPage.assertAddCredentialButtonVisible();
});
