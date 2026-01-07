import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 모달 Step Definitions
 *
 * 확인 모달 관련 Step 정의
 */

const { When, Then } = createBdd(test);

Then("{string} 모달이 표시된다", async ({ modal }, title: string) => {
  await modal.waitForVisibleWithTitle(title);
});

Then("{string} 모달이 닫힌다", async ({ modal }) => {
  await modal.waitForHidden();
});

When("{string} 모달의 확인 버튼을 클릭한다", async ({ modal }) => {
  await modal.clickOk();
});

When("{string} 모달의 취소 버튼을 클릭한다", async ({ modal }) => {
  await modal.clickCancel();
});
