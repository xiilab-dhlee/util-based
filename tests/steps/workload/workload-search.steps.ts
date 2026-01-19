import { createBdd } from "playwright-bdd";

import {
  SELECTOR,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 워크로드 검색 Step Definitions
 *
 * 검색 기능 관련 Step 정의:
 * - 검색 결과 검증
 *
 * NOTE: 검색어 입력 Step은 common/list.steps.ts로 이동됨
 * - "목록 페이지의 검색창에 {string}를 입력한다"
 */
const { Then } = createBdd(test);

// ============================================
// 검색 결과 검증
// ============================================

/**
 * 검색어가 포함된 데이터만 표시되는지 검증
 *
 * DataTableComponent의 validateSearch 메서드 사용
 */
Then(
  "워크로드 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ workloadListPage, listSearchInput, assertLogger, $testInfo }) => {
    // 테이블이 표시될 때까지 대기
    await workloadListPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    // 검색 결과 검증
    await workloadListPage.table.validateSearch(
      await listSearchInput.getValue(),
      WORKLOAD_SELECTOR.NAME,
      assertLogger,
      $testInfo,
      "워크로드",
    );
  },
);
