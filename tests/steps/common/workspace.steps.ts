import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 워크스페이스 Step Definitions
 *
 * 워크스페이스 선택 관련 Step 정의
 */

const { Given } = createBdd(test);

Given("워크스페이스가 선택되어 있다", async ({ page, assertLogger }) => {
  const workspaceSelectValue = page.locator(
    testId(SELECTOR.WORKSPACE_SELECT_VALUE),
  );
  await expect(workspaceSelectValue).toBeVisible({ timeout: 10000 });

  const workspaceText = await workspaceSelectValue.textContent();
  assertLogger.assertNotEmpty("워크스페이스", workspaceText);
});
