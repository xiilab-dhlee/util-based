import { createBdd } from "playwright-bdd";

import {
  ACCOUNT_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 계정 관리 검색 Step Definitions
 */
const { Then } = createBdd(test);

Then(
  "계정 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({
    accountManagementPage,
    listSearchInput,
    assertLogger,
    $testInfo,
  }) => {
    // 테이블이 표시될 때까지 대기
    await accountManagementPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    // 검색 결과 검증
    await accountManagementPage.table.validateSearch(
      await listSearchInput.getValue(),
      ACCOUNT_SELECTOR.NAME,
      assertLogger,
      $testInfo,
      "계정",
    );
  },
);
