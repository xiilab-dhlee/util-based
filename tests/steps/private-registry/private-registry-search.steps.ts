import { createBdd } from "playwright-bdd";

import {
  PRIVATE_REGISTRY_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 개인 레지스트리 검색 Step Definitions
 *
 * 구조:
 * 1. 개인 레지스트리 검색 결과 검증
 * 2. 등록 중인 이미지 검색
 */
const { When, Then } = createBdd(test);

// ============================================
// 1. 개인 레지스트리 검색 결과 검증
// ============================================

Then(
  "개인 레지스트리 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({
    privateRegistryListPage,
    listSearchInput,
    assertLogger,
    $testInfo,
  }) => {
    // 테이블이 표시될 때까지 대기
    await privateRegistryListPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    // 검색 결과 검증
    await privateRegistryListPage.table.validateSearch(
      await listSearchInput.getValue(),
      PRIVATE_REGISTRY_SELECTOR.IMAGE_NAME,
      assertLogger,
      $testInfo,
      "개인 레지스트리",
    );
  },
);

// ============================================
// 2. 등록 중인 이미지 검색
// ============================================

When(
  "등록 중인 이미지 목록의 검색창에 {string}를 입력한다",
  async ({ privateRegistryListPage }, keyword: string) => {
    await privateRegistryListPage.jobListSearchInput.search(keyword);
  },
);

Then(
  "등록 중인 이미지 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ privateRegistryListPage, assertLogger, $testInfo }) => {
    // 카드가 표시될 때까지 대기
    await privateRegistryListPage.jobListGrid.assertCardsVisible();

    // 검색 결과 검증
    await privateRegistryListPage.jobListGrid.validateSearch(
      await privateRegistryListPage.jobListSearchInput.getValue(),
      assertLogger,
      $testInfo,
      "등록 중인 이미지",
    );
  },
);
