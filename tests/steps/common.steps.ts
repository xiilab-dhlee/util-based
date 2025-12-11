import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { test } from "../fixtures";
import {
  clearAuthCookies,
  getSession,
  hasAuthCookie,
  isAuthenticated,
  loginAs,
} from "../support/auth.helper";

const { Given, Then } = createBdd(test);

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

Given("사용자는 로그인 상태이다", async ({ page, assertLogger }) => {
  await loginAs(page.context(), "user");

  const hasCookie = await hasAuthCookie(page);
  assertLogger.assertEqual("세션 쿠키 존재", hasCookie, true);

  const authenticated = await isAuthenticated(page);
  assertLogger.assertEqual("인증 상태", authenticated, true);

  const session = await getSession(page);
  assertLogger.assertEqual(
    "사용자명",
    session?.preferred_username ?? "",
    "user",
  );
});

Given("사용자는 로그인하지 않은 상태이다", async ({ page, assertLogger }) => {
  await clearAuthCookies(page.context());

  const hasCookie = await hasAuthCookie(page);
  assertLogger.assertEqual("세션 쿠키 없음", hasCookie, false);

  const authenticated = await isAuthenticated(page);
  assertLogger.assertEqual("미인증 상태", authenticated, false);
});

Then("로그인 페이지로 리다이렉트된다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(login|signin|auth)/i, { timeout: 10000 });
});

// ============================================
// 워크스페이스 관련 Steps
// ============================================

Given("워크스페이스가 선택되어 있다", async ({ page, assertLogger }) => {
  const workspaceSelectValue = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_VALUE),
  );
  await expect(workspaceSelectValue).toBeVisible({ timeout: 10000 });

  const workspaceText = await workspaceSelectValue.textContent();
  assertLogger.assertNotEmpty("워크스페이스", workspaceText);
});

Given("워크스페이스가 선택되어 있지 않다", async ({ page }) => {
  const placeholder = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_PLACEHOLDER),
  );
  await expect(placeholder).toBeVisible({ timeout: 10000 });
});

// ============================================
// URL 관련 Steps
// ============================================

Then("URL이 {string}이다", async ({ page }, expectedUrl: string) => {
  await expect(page).toHaveURL(new RegExp(expectedUrl));
});

Then("URL이 {string}를 포함한다", async ({ page }, expectedUrl: string) => {
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+")
    .replace(/\//g, "\\/")
    .replace(/\?/g, "\\?");

  await expect(page).toHaveURL(new RegExp(regexPattern));
});

Then("URL이 {string}와 일치한다", async ({ page }, expectedUrl: string) => {
  const regexPattern = expectedUrl
    .replace(/\[[\w]+\]/g, "[\\w-]+")
    .replace(/\//g, "\\/");

  await expect(page).toHaveURL(new RegExp(`${regexPattern}(\\?.*)?$`));
});

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

Then("목록 테이블이 표시된다", async ({ page }) => {
  const table = page.locator(testId(SELECTOR.LIST_TABLE));
  await expect(table).toBeVisible({ timeout: 10000 });
});

Then("목록에 총 개수가 표시된다", async ({ page, assertLogger }) => {
  const totalCount = page.locator(testId(SELECTOR.LIST_TOTAL_COUNT));
  await expect(totalCount).toBeVisible({ timeout: 10000 });

  const text = (await totalCount.textContent()) ?? "";
  assertLogger.assertMatch("총 개수 형식", text, /총\s*\d+/);
});

Then("페이지네이션이 표시된다", async ({ page }) => {
  const pagination = page.locator(testId(SELECTOR.LIST_PAGINATION));
  await expect(pagination).toBeVisible({ timeout: 10000 });
});

Then("검색창이 빈 값으로 표시된다", async ({ page }) => {
  const searchInput = page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await expect(searchInput).toHaveValue("");
});

// ============================================
// 탭 관련 Steps
// ============================================

Then("{string} 탭이 선택되어 있다", async ({ page }, tabName: string) => {
  const activeTab = page.locator(".tabs-nav .tab-item.active .tab-label");
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toHaveText(tabName);
});

Then("{string} 탭이 비활성화되어 있다", async ({ page }, tabName: string) => {
  const activeTab = page.locator(".tabs-nav .tab-item.disabled .tab-label");
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toHaveText(tabName);
});
