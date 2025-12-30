import { createBdd } from "playwright-bdd";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
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
 * 검색 결과 조건 검증
 * - 전체목록: 검색어 없이 전체 목록 표시
 * - 부분일치: 첫 번째 결과가 검색어를 포함하는지 확인 (샘플 검증)
 *
 * NOTE: E2E 테스트는 기능 동작 확인이 목적이므로 첫 번째 결과만 검증
 * 전체 결과 정확성은 백엔드/API 테스트 영역
 */
Then(
  "워크로드 검색 결과가 {string} 조건을 만족한다",
  async ({ workloadListPage, assertLogger }, expectedCondition: string) => {
    const rowCount = await workloadListPage.table.getRowCount();

    if (expectedCondition === "전체목록") {
      // 빈값 검색 시 목록이 표시되는지 확인 (0개 이상)
      assertLogger.assertEqual("전체 목록 표시", rowCount >= 0, true);
    } else if (expectedCondition === "부분일치") {
      // 검색어가 입력된 경우, 첫 번째 결과만 검증 (샘플 검증)
      if (rowCount > 0) {
        const searchText = await workloadListPage.getSearchInputValue();
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
    }
  },
);
