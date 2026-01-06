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
 * - 첫 번째 결과가 검색어를 포함하는지 확인 (샘플 검증)
 *
 * NOTE: E2E 테스트는 기능 동작 확인이 목적이므로 첫 번째 결과만 검증
 * 전체 결과 정확성은 백엔드/API 테스트 영역
 */
Then(
  "워크로드 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ workloadListPage, listSearchInput, assertLogger }) => {
    // 테이블이 표시될 때까지 대기
    await workloadListPage.table.assertTableVisible(SELECTOR.LIST_TABLE);
    const rowCount = await workloadListPage.table.getRowCount();

    if (rowCount > 0) {
      const searchText = await listSearchInput.getValue();
      const firstRowName = await workloadListPage.table.getCellText(
        0,
        WORKLOAD_SELECTOR.NAME,
      );
      const containsSearch = firstRowName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      assertLogger.assertEqual(
        `첫 번째 결과가 "${searchText}" 포함`,
        containsSearch,
        true,
      );
    }
  },
);
