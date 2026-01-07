import { createBdd } from "playwright-bdd";

import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 목록 페이지 공통 Step Definitions
 *
 * 모든 도메인의 목록 페이지에서 재사용 가능한 Step 정의
 * - 테이블 표시 검증
 * - 카드 그리드 표시 검증
 * - 총 개수 표시 검증
 * - 페이지네이션 검증
 * - 검색 입력 검증
 * - 빈 목록/에러 메시지 검증
 *
 * 험블 객체 사용:
 * - listTable: DataTableComponent fixture (테이블 관련 검증)
 * - listGrid: CardGridComponent fixture (카드 그리드 관련 검증)
 * - myItemsSwitch: SwitchComponent fixture (스위치 관련 검증)
 * - listSearchInput: SearchInputComponent fixture (검색 관련)
 * - listPagination: PaginationComponent fixture (페이지네이션 관련)
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 테이블 표시 검증
// ============================================

/**
 * 목록 페이지의 테이블이 표시되는지 검증
 * - 테이블 컨테이너가 visible인지 확인
 * - 로딩 스피너가 사라질 때까지 대기 (로딩 완료)
 *
 * listTable fixture (DataTableComponent) 사용
 */
Then("목록 페이지의 테이블이 표시된다", async ({ listTable }) => {
  await listTable.assertTableVisible(SELECTOR.LIST_TABLE);
});

/**
 * 목록 페이지의 테이블에 최소 n개의 데이터가 있는지 검증
 * - 행 개수가 minCount 미만이면 테스트 스킵
 *
 * listTable fixture (DataTableComponent) 사용
 */
Given(
  "목록 페이지의 테이블 내 {int}개 이상의 데이터가 있다",
  async ({ listTable, $testInfo }, minCount: number) => {
    const count = await listTable.getRowCount();
    if (count < minCount) {
      $testInfo.skip(
        true,
        `테이블 행이 ${minCount}개 미만이어서 시나리오를 스킵합니다`,
      );
    }
  },
);

// ============================================
// 카드 그리드 표시 검증
// ============================================

/**
 * 목록 페이지의 카드 그리드가 표시되는지 검증
 * - 그리드 컨테이너가 visible인지 확인
 *
 * listGrid fixture (CardGridComponent) 사용
 */
Then("목록 페이지의 그리드가 표시된다", async ({ listGrid }) => {
  await listGrid.assertGridVisible();
});

/**
 * 목록 페이지의 그리드에 최소 n개의 데이터가 있는지 검증
 * - 카드 개수가 minCount 미만이면 테스트 스킵
 *
 * listGrid fixture (CardGridComponent) 사용
 */
Given(
  "목록 페이지의 그리드 내 {int}개 이상의 데이터가 있다",
  async ({ listGrid, $testInfo }, minCount: number) => {
    const count = await listGrid.getCardCount();
    if (count < minCount) {
      $testInfo.skip(
        true,
        `카드가 ${minCount}개 미만이어서 시나리오를 스킵합니다`,
      );
    }
  },
);

// ============================================
// 총 개수 표시
// ============================================

/**
 * 목록 페이지의 총 개수가 숫자 형식으로 표시되는지 검증
 * - 숫자만, 또는 천 단위 콤마 포함 형식 허용
 */
Then("목록 페이지의 총 개수가 표시된다", async ({ page, assertLogger }) => {
  const totalCount = page.getByTestId(SELECTOR.LIST_TOTAL_COUNT);
  const text = (await totalCount.textContent()) ?? "";
  assertLogger.assertMatch("총 개수", text, /^\d+(,\d{3})*$/);
});

/**
 * 목록 페이지의 총 개수가 특정 값으로 표시되는지 검증
 */
Then(
  "목록 페이지의 총 개수가 {int}개로 표시된다",
  async ({ page, assertLogger }, expected: number) => {
    const totalCount = page.getByTestId(SELECTOR.LIST_TOTAL_COUNT);
    const text = (await totalCount.textContent()) ?? "";
    const actual = parseInt(text.replace(/,/g, ""), 10);
    assertLogger.assertEqual(`총 개수 ${expected}개`, actual, expected);
  },
);

// ============================================
// 페이지네이션
// ============================================

/**
 * 목록 페이지의 페이지네이션이 표시되는지 검증
 *
 * listPagination fixture (PaginationComponent) 사용
 */
Then("목록 페이지의 페이지네이션이 표시된다", async ({ listPagination }) => {
  await listPagination.assertVisible();
});

// ============================================
// 검색 입력
// ============================================

/**
 * 목록 페이지의 검색창이 빈 값으로 표시되는지 검증
 *
 * listSearchInput fixture (SearchInputComponent) 사용
 */
Then(
  "목록 페이지의 검색창이 빈 값으로 표시된다",
  async ({ listSearchInput }) => {
    await listSearchInput.assertEmpty();
  },
);

/**
 * 목록 페이지의 검색창에 검색어 입력
 *
 * listSearchInput fixture (SearchInputComponent) 사용
 */
When(
  "목록 페이지의 검색창에 {string}를 입력한다",
  async ({ listSearchInput }, searchText: string) => {
    await listSearchInput.search(searchText);
  },
);

// ============================================
// 내 항목만 보기 스위치
// ============================================

/**
 * 목록 페이지의 "내 항목만 보기" 스위치 상태 검증
 * - 선택됨: 스위치가 체크 상태
 * - 선택되지 않음: 스위치가 체크 해제 상태
 *
 * myItemsSwitch fixture (SwitchComponent) 사용
 */
Then(
  /^목록 페이지의 내 항목만 보기가 (선택되어 있다|선택되어 있지 않다)$/,
  async ({ myItemsSwitch }, state: string) => {
    if (state === "선택되어 있다") {
      await myItemsSwitch.assertChecked();
    } else {
      await myItemsSwitch.assertUnchecked();
    }
  },
);

// ============================================
// 테이블 메시지 검증
// ============================================

/**
 * 목록 페이지의 테이블에 빈 목록/에러 메시지가 표시되는지 검증
 * - EMPTY: "조회된 결과가 없습니다."
 * - ERROR: "데이터를 불러올 수 없습니다."
 *
 * listTable fixture (DataTableComponent) 사용
 */
Then(
  /^목록 페이지의 테이블에 (EMPTY|ERROR) 메시지가 표시된다$/,
  async ({ listTable }, messageType: keyof typeof TABLE_MESSAGE) => {
    const expectedMessage = TABLE_MESSAGE[messageType];
    await listTable.assertEmptyMessage(SELECTOR.LIST_TABLE, expectedMessage);
  },
);
