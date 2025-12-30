import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * Step 진행 상태 Step Definitions
 *
 * 멀티스텝 폼의 진행 상태 관련 Step 정의
 */

const { Then } = createBdd(test);

/** Step 번호와 조상 클래스 매핑 */
const STEP_CLASS_MAP: Record<number, string> = {
  1: "first-step",
  2: "middle-step",
  3: "middle-step",
  4: "last-step",
};

/** Step 번호와 텍스트 매핑 */
const STEP_TEXT_MAP: Record<number, string> = {
  1: "01",
  2: "02",
  3: "03",
  4: "04",
};

Then(/^현재 Step이 (\d+)이다$/, async ({ page }, stepNum: number) => {
  const stepClass = STEP_CLASS_MAP[stepNum];
  const stepText = STEP_TEXT_MAP[stepNum];

  // 조상에 active와 step-class가 공존하고, step-title에 해당 텍스트가 있는지 확인
  const activeStep = page.locator(
    `.${stepClass}.active .step-title:text("${stepText}")`,
  );
  await expect(activeStep).toBeVisible({ timeout: 10000 });
});
