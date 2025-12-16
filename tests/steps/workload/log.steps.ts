import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  SELECTOR,
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { ThemePopoverComponent } from "../../components/theme-popover.component";
import { test } from "../../fixtures";

/**
 * 워크로드 로그 페이지 Step Definitions
 *
 * 로그 페이지 관련 인터랙션:
 * - 테마 적용 결과 확인
 * - 모니터링 패널
 * - 차트 확대
 *
 * NOTE: 테마 변경 관련 step은 common.steps.ts에서 공통 관리
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 테마 변경 결과 확인 Steps
// ============================================

Then("로그 영역에 선택한 테마가 표시된다", async ({ page }) => {
  const logViewer = page.locator(testId(WORKLOAD_SELECTOR.LOG_VIEWER));
  await expect(logViewer).toBeVisible({ timeout: 5000 });

  // 테마 클래스가 적용되었는지 확인
  const className = (await logViewer.getAttribute("class")) ?? "";
  const hasTheme = ThemePopoverComponent.THEME_NAMES.some((theme) =>
    className.includes(theme),
  );
  expect(hasTheme).toBe(true);
});

// ============================================
// 모니터링 사이드 패널 Steps
// ============================================

When("모니터링 버튼을 클릭한다", async ({ page }) => {
  const button = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_MONITORING_BUTTON),
  );
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
});

Then("모니터링 사이드 패널이 표시된다", async ({ page }) => {
  const panel = page.locator(testId(WORKLOAD_SELECTOR.ASIDE_MONITORING));
  await expect(panel).toBeVisible({ timeout: 5000 });
});

Given("모니터링 버튼을 클릭하여 모니터링 패널을 연다", async ({ page }) => {
  const button = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_MONITORING_BUTTON),
  );
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
  const panel = page.locator(testId(WORKLOAD_SELECTOR.ASIDE_MONITORING));
  await expect(panel).toBeVisible({ timeout: 5000 });
});

// ============================================
// 모니터링 차트 확대 Steps
// ============================================

When("차트 확대 버튼을 클릭한다", async ({ page }) => {
  const expandButton = page
    .locator(testId(WORKLOAD_SELECTOR.MONITORING_CHART_EXPAND_BUTTON))
    .first();
  await expect(expandButton).toBeVisible({ timeout: 5000 });
  await expandButton.click();
});

Then("차트 확대 모달이 표시된다", async ({ page }) => {
  const modal = page.locator(SELECTOR.MODAL);
  await expect(modal).toBeVisible({ timeout: 5000 });
});
