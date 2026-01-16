import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 허브 검색 Step Definitions
 */
const { Then } = createBdd(test);

/**
 * 검색어가 포함된 데이터만 표시되는지 검증
 *
 * CardGridComponent의 validateSearch 메서드 사용
 */
Then(
  "허브 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ listGrid, listSearchInput, assertLogger, $testInfo }) => {
    // 스켈레톤이 사라지고 카드가 표시될 때까지 대기
    await listGrid.assertCardsVisible();

    // 검색 결과 검증
    await listGrid.validateSearch(
      await listSearchInput.getValue(),
      assertLogger,
      $testInfo,
      "허브",
    );
  },
);
