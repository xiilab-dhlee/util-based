import { createBdd } from "playwright-bdd";

import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 계정 관리 정렬 Step Definitions
 */
const { When, Then } = createBdd(test);

/** 한글 정렬 기준 → 셀 selector 매핑 */
const SORT_CELL_MAP: Record<string, string> = {
  이름: ACCOUNT_SELECTOR.NAME,
  가입일: ACCOUNT_SELECTOR.CREATED_AT,
};

When(
  "계정 목록을 {string} 기준 {string}으로 정렬한다",
  async (
    { accountManagementPage },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    await accountManagementPage.table.sortByColumn(field, order);
  },
);

Then(
  "계정 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
  async (
    { accountManagementPage, assertLogger },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    const cellSelector = SORT_CELL_MAP[field];
    if (!cellSelector) {
      throw new Error(`알 수 없는 정렬 필드: ${field}`);
    }

    // 로딩 완료 대기
    await accountManagementPage.table.waitForLoaded();

    // 실제 데이터 정렬 순서 검증
    const compareType = field === "가입일" ? "date" : "string";
    await accountManagementPage.table.assertDataSortOrder(
      cellSelector,
      order,
      assertLogger,
      compareType,
    );
  },
);
