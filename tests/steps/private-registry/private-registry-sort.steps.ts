import { createBdd } from "playwright-bdd";

import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 개인 레지스트리 정렬 Step Definitions
 */
const { When, Then } = createBdd(test);

/** 한글 정렬 기준 → 셀 selector 매핑 */
const SORT_CELL_MAP: Record<string, string> = {
  생성일: PRIVATE_REGISTRY_SELECTOR.CREATED_AT,
};

When(
  "개인 레지스트리 목록을 {string} 기준 {string}으로 정렬한다",
  async (
    { privateRegistryListPage },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    await privateRegistryListPage.table.sortByColumn(field, order);
  },
);

Then(
  "개인 레지스트리 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
  async (
    { privateRegistryListPage, assertLogger },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    const cellSelector = SORT_CELL_MAP[field];
    if (!cellSelector) {
      throw new Error(`알 수 없는 정렬 필드: ${field}`);
    }

    // 로딩 완료 대기
    await privateRegistryListPage.table.waitForLoaded();

    // 실제 데이터 정렬 순서 검증
    const compareType = field === "생성일" ? "date" : "string";
    await privateRegistryListPage.table.assertDataSortOrder(
      cellSelector,
      order,
      assertLogger,
      compareType,
    );
  },
);
