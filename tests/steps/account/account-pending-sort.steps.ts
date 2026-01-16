import { createBdd } from "playwright-bdd";

import { ACCOUNT_PENDING_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 가입 승인 정렬 Step Definitions
 */
const { When, Then } = createBdd(test);

const SORT_CELL_MAP: Record<string, string> = {
  이름: ACCOUNT_PENDING_SELECTOR.NAME,
  가입일: ACCOUNT_PENDING_SELECTOR.CREATED_AT,
};

When(
  "가입 승인 목록을 {string} 기준 {string}으로 정렬한다",
  async (
    { accountPendingPage },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    await accountPendingPage.table.sortByColumn(field, order);
  },
);

Then(
  "가입 승인 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
  async (
    { accountPendingPage, assertLogger },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    const cellSelector = SORT_CELL_MAP[field];
    if (!cellSelector) {
      throw new Error(`알 수 없는 정렬 필드: ${field}`);
    }

    await accountPendingPage.table.waitForLoaded();

    const compareType = field === "가입일" ? "date" : "string";
    await accountPendingPage.table.assertDataSortOrder(
      cellSelector,
      order,
      assertLogger,
      compareType,
    );
  },
);
