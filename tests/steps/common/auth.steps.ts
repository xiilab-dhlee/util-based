import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 인증 Step Definitions
 *
 * 사용자 인증 관련 Step 정의
 *
 * NOTE: API Mock 설정은 hooks.ts의 Before hook에서 자동으로 수행됩니다.
 * 이 Step들은 Feature 파일의 가독성을 위해 유지되며, 실제 동작은 없습니다.
 * 인증 쿠키는 storageState로 Playwright가 자동 관리합니다.
 */

const { Given } = createBdd(test);

/**
 * 사용자 인증 Step (No-op)
 *
 * - Mock 설정: hooks.ts Before hook에서 자동 수행
 * - 인증 쿠키: playwright.config.ts의 storageState로 자동 로드
 */
Given("사용자가 로그인되어 있다", async () => {
  // No-op: Mock과 인증은 hooks.ts에서 자동 처리
});

/**
 * 관리자 인증 Step (No-op)
 *
 * - Mock 설정: hooks.ts Before hook에서 자동 수행
 * - 인증 쿠키: playwright.config.ts의 admin 프로젝트 storageState로 자동 로드
 */
Given("관리자가 로그인되어 있다", async () => {
  // No-op: Mock과 인증은 hooks.ts에서 자동 처리
});
