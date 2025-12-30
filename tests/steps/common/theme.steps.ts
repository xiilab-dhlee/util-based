import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 테마 변경 Step Definitions
 *
 * 테마 설정 관련 Step 정의
 */

const { When } = createBdd(test);

When("테마 변경 버튼을 클릭한다", async ({ page }) => {
  const button = page.locator(testId(SELECTOR.THEME_BUTTON));
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
});

When("다른 테마 색상을 선택한다", async ({ themePopover, themeContext }) => {
  const selectedTheme = await themePopover.selectDifferentTheme();
  themeContext.setSelectedTheme(selectedTheme);
});
