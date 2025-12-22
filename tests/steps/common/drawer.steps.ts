import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 드로어 Step Definitions
 *
 * 드로어(사이드 패널) 관련 Step 정의
 */

const { When, Then } = createBdd(test);

Then("{string} 드로어가 표시된다", async ({ drawer }, drawerTitle: string) => {
  await drawer.waitForVisible();
  await drawer.assertTitle(drawerTitle);
});

Then("드로어가 닫힌다", async ({ drawer }) => {
  await drawer.waitForHidden();
});

When(
  /^드로어의 "(취소|이전 단계)" 버튼을 클릭한다$/,
  async ({ drawer }, buttonText: string) => {
    await drawer.clickButton(buttonText);
  },
);
