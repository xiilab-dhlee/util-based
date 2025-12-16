import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { ThemePopoverComponent } from "../../components/theme-popover.component";
import { test } from "../../fixtures";

/**
 * 워크로드 웹터미널 페이지 Step Definitions
 *
 * 웹터미널 페이지 관련 인터랙션:
 * - 테마 적용 결과 확인
 * - 터미널 패널 분할
 *
 * NOTE: 테마 변경/모니터링 패널 관련 step은 common.steps.ts에서 공통 관리
 */
const { When, Then } = createBdd(test);

// ============================================
// 테마 변경 결과 확인 Steps
// ============================================

Then("웹터미널 영역에 선택한 테마가 표시된다", async ({ page }) => {
  const terminalContainer = page.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
  );
  await expect(terminalContainer).toBeVisible({ timeout: 5000 });

  // 테마 클래스가 적용되었는지 확인
  const className = (await terminalContainer.getAttribute("class")) ?? "";
  const hasTheme = ThemePopoverComponent.THEME_NAMES.some((theme) =>
    className.includes(theme),
  );
  expect(hasTheme).toBe(true);
});

// ============================================
// 터미널 패널 분할 Steps
// ============================================

Then("웹터미널 패널이 {int}개 표시된다", async ({ page }, count: number) => {
  const panels = page.locator(testId(WORKLOAD_SELECTOR.TERMINAL_NODE));
  await expect(panels.first()).toBeVisible({ timeout: 10000 });
  await expect(panels).toHaveCount(count);
});

When("수직 분할 버튼을 클릭한다", async ({ page }) => {
  const button = page
    .locator(testId(WORKLOAD_SELECTOR.TERMINAL_SPLIT_VERTICAL_BUTTON))
    .first();
  await expect(button).toBeVisible({ timeout: 5000 });
  await button.click();
});

When("수평 분할 버튼을 클릭한다", async ({ page }) => {
  const button = page
    .locator(testId(WORKLOAD_SELECTOR.TERMINAL_SPLIT_HORIZONTAL_BUTTON))
    .first();
  await expect(button).toBeVisible({ timeout: 5000 });
  await button.click();
});
