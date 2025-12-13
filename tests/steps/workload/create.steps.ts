import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";

/**
 * 워크로드 생성 드로어 Step Definitions
 */
const { When, Then } = createBdd(test);

// ============================================
// 버튼 관련
// ============================================

When("워크로드 생성하기 버튼을 클릭한다", async ({ page }) => {
  const button = page.locator(testId(WORKLOAD_SELECTOR.CREATE_BUTTON));
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
});

Then(
  /^"(최근 워크로드 가져오기|워크로드 목록에서 가져오기)" 버튼이 표시된다$/,
  async ({ page }, buttonText: string) => {
    const selector = WorkloadListPage.CREATE_BUTTON[buttonText];
    await expect(page.locator(testId(selector))).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  /^"(Batch Job|Interactive Job)" 버튼이 선택되어 있다$/,
  async ({ page }, buttonText: string) => {
    const labelMap: Record<string, string> = {
      "Batch Job": "Batch Job",
      "Interactive Job": "Interactive Job (IDE)",
    };
    const label = labelMap[buttonText];

    // JobTypeCard의 data-active 속성으로 선택 상태 확인
    const card = page.getByRole("button", { name: label });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute("data-active", "true");
  },
);

// ============================================
// 입력창 관련
// ============================================

Then("워크로드 이름 입력창이 빈 값으로 표시된다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toHaveValue("");
});

Then("워크로드 설명 입력창이 빈 값으로 표시된다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_DESCRIPTION));
  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toHaveValue("");
});
