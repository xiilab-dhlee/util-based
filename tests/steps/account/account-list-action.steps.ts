import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 계정 관리 액션 Step Definitions
 */
const { When } = createBdd(test);

// ============================================
// 체크박스 및 삭제 기능
// ============================================

When(
  "첫 번째 계정의 체크박스를 클릭한다",
  async ({ accountManagementPage }) => {
    await accountManagementPage.table.clickRowCheckbox(0);
  },
);
