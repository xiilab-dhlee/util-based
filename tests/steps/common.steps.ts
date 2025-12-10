import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import {
  clearAuthCookies,
  getSession,
  hasAuthCookie,
  isAuthenticated,
  loginAs,
} from "../support/auth.helper";

const { Given, Then } = createBdd();

/**
 * 공통 Step Definitions
 *
 * 여러 도메인에서 공통으로 사용되는 Step 정의
 * - 인증 관련 (로그인/로그아웃 상태)
 * - 워크스페이스 관련
 * - URL 검증
 */

// ============================================
// 인증 관련 Steps
// ============================================

/**
 * Given - 로그인 상태 확인 (일반 사용자)
 * NextAuth CredentialsProvider를 통해 실제 로그인 수행
 * 일반 사용자로 로그인하여 /user/* 경로에 접근 가능
 */
Given("사용자는 로그인 상태이다", async ({ page }) => {
  // NextAuth API를 통해 실제 로그인 수행 (user 사용자)
  await loginAs(page.context(), "user");

  // 세션 쿠키가 설정되었는지 확인
  const hasCookie = await hasAuthCookie(page);
  expect(hasCookie).toBeTruthy();

  // 세션 API를 통해 인증 상태 검증
  const authenticated = await isAuthenticated(page);
  expect(authenticated).toBeTruthy();

  // 세션 사용자 정보 확인
  const session = await getSession(page);
  expect(session).not.toBeNull();
  expect(session?.preferred_username).toBe("user");
});

/**
 * Given - 로그인하지 않은 상태
 */
Given("사용자는 로그인하지 않은 상태이다", async ({ page }) => {
  // 모든 인증 쿠키 제거
  await clearAuthCookies(page.context());

  // 세션 쿠키가 없는지 확인
  const hasCookie = await hasAuthCookie(page);
  expect(hasCookie).toBeFalsy();

  // 세션 API로 인증 상태 확인
  const authenticated = await isAuthenticated(page);
  expect(authenticated).toBeFalsy();
});

/**
 * Then - 로그인 페이지 리다이렉트 확인
 */
Then("로그인 페이지로 리다이렉트된다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(login|signin|auth)/i, { timeout: 10000 });
});

// ============================================
// 워크스페이스 관련 Steps
// ============================================

/**
 * Given/And - 워크스페이스 선택 상태 확인
 */
Given("워크스페이스가 선택되어 있다", async ({ page }) => {
  const workspaceSelectValue = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_VALUE),
  );

  await expect(workspaceSelectValue).toBeVisible({ timeout: 10000 });

  const workspaceText = await workspaceSelectValue.textContent();
  expect(workspaceText).toBeTruthy();
  expect(workspaceText?.trim().length).toBeGreaterThan(0);
});

/**
 * And - 워크스페이스 미선택 상태 확인
 */
Given("워크스페이스가 선택되어 있지 않다", async ({ page }) => {
  const placeholder = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_PLACEHOLDER),
  );
  await expect(placeholder).toBeVisible({ timeout: 10000 });
});

// ============================================
// URL 관련 Steps
// ============================================

/**
 * Then - URL 검증 (정확히 일치)
 */
Then("URL이 {string}이다", async ({ page }, expectedUrl: string) => {
  await expect(page).toHaveURL(new RegExp(expectedUrl));
});

/**
 * Then - URL 포함 검증
 *
 * 동적 경로 패턴 지원:
 * - [xxx] 형식의 모든 패턴을 동적 값으로 매칭
 * - 예: /user/workload/[id] -> /user/workload/123
 */
Then("URL이 {string}를 포함한다", async ({ page }, expectedUrl: string) => {
  // 동적 경로 패턴 [xxx]를 정규표현식으로 변환
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+") // [xxx] -> 숫자, 문자, 하이픈 매칭
    .replace(/\//g, "\\/") // 슬래시 이스케이프
    .replace(/\?/g, "\\?"); // 물음표 이스케이프

  await expect(page).toHaveURL(new RegExp(regexPattern));
});

/**
 * Then - URL 일치 검증 (경로 끝 부분이 정확히 일치)
 *
 * 동적 경로 패턴 지원:
 * - [xxx] 형식의 모든 패턴을 동적 값으로 매칭
 * - 예: /user/workload/[id] -> /user/workload/123
 * - 예: /user/volume/[name] -> /user/volume/my-volume
 */
Then("URL이 {string}와 일치한다", async ({ page }, expectedUrl: string) => {
  // 동적 경로 패턴 [xxx]를 정규표현식으로 변환
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+") // [xxx] -> 숫자, 문자, 하이픈 매칭
    .replace(/\//g, "\\/"); // 슬래시 이스케이프

  await expect(page).toHaveURL(new RegExp(`${regexPattern}(\\?.*)?$`));
});

/**
 * Then - 네비게이션 메뉴 활성화 상태 확인
 * Ant Design Menu의 선택된 메뉴 아이템 텍스트 검증
 */
Then(
  "네비게이션 메뉴 중 {string} 메뉴가 활성화되어 있다",
  async ({ page }, menuName: string) => {
    const selectedMenu = page.locator(
      ".ant-menu-item-selected .ant-menu-title-content",
    );
    await expect(selectedMenu).toBeVisible({ timeout: 10000 });
    await expect(selectedMenu).toHaveText(menuName);
  },
);

// ============================================
// 목록 페이지 공통 Steps
// ============================================

/**
 * Then - 목록 테이블 표시 확인
 */
Then("목록 테이블이 표시된다", async ({ page }) => {
  const table = page.locator(testId(SELECTOR.LIST_TABLE));
  await expect(table).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 목록에 총 개수 표시 확인
 */
Then("목록에 총 개수가 표시된다", async ({ page }) => {
  const totalCount = page.locator(testId(SELECTOR.LIST_TOTAL_COUNT));
  await expect(totalCount).toBeVisible({ timeout: 10000 });

  const text = await totalCount.textContent();
  expect(text).toMatch(/총\s*\d+/);
});

/**
 * Then - 페이지네이션 표시 확인
 */
Then("페이지네이션이 표시된다", async ({ page }) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  await expect(pagination).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 검색창 빈 값 확인
 */
Then("검색창이 빈 값으로 표시된다", async ({ page }) => {
  const searchInput = page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await expect(searchInput).toHaveValue("");
});

// ============================================
// 탭 관련 Steps
// ============================================

/**
 * Then - 탭 선택 상태 확인
 * tabs-nav 하위 활성화된 탭의 라벨 텍스트 검증
 */
Then("{string} 탭이 선택되어 있다", async ({ page }, tabName: string) => {
  const activeTab = page.locator(".tabs-nav .tab-item.active .tab-label");
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toHaveText(tabName);
});

/**
 * Then - 탭 활성화 상태 확인 (파라미터화)
 */
Then("{string} 탭이 비활성화되어 있다", async ({ page }, tabName: string) => {
  const activeTab = page.locator(".tabs-nav .tab-item.disabled .tab-label");
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toHaveText(tabName);
});
