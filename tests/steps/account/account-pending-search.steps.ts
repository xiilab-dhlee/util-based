import { createBdd } from "playwright-bdd";

import {
  ACCOUNT_PENDING_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 가입 승인 검색 Step Definitions
 */
const { Then } = createBdd(test);

Then(
  "가입 신청 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ accountPendingPage, listSearchInput, assertLogger, $testInfo }) => {
    await accountPendingPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    await accountPendingPage.table.validateSearch(
      await listSearchInput.getValue(),
      ACCOUNT_PENDING_SELECTOR.NAME,
      assertLogger,
      $testInfo,
      "가입 신청",
    );
  },
);
