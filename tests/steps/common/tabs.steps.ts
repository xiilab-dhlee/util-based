import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 탭 Step Definitions
 *
 * 탭 네비게이션 관련 Step 정의
 */

const { Then, When } = createBdd(test);

When("{string} 탭을 클릭한다", async ({ tabs }, tabName: string) => {
  await tabs.clickTab(tabName);
});

Then("{string} 탭이 선택되어 있다", async ({ tabs }, tabName: string) => {
  await tabs.assertActiveTab(tabName);
});

Then(
  /^"(.+)" 탭이 (활성화|비활성화)되어 있다$/,
  async ({ tabs }, tabName: string, state: string) => {
    if (state === "활성화") {
      await tabs.assertTabEnabled(tabName);
    } else {
      await tabs.assertTabDisabled(tabName);
    }
  },
);
