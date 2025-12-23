import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 목록 페이지 공통 Step Definitions
 *
 * 모든 도메인의 목록 페이지에서 재사용 가능한 Step 정의
 * - 테이블 표시 검증
 * - 총 개수 표시 검증
 * - 페이지네이션 검증
 * - 검색 입력 검증
 * - 빈 목록/에러 메시지 검증
 *
 * 공통 셀렉터: SELECTOR.LIST_TOTAL_COUNT, LIST_PAGINATION, LIST_SEARCH_INPUT
 */
const { When, Then } = createBdd(test);

// ============================================
// 테이블 표시 검증
// ============================================

/**
 * 목록 페이지의 테이블이 표시되는지 검증
 * - 테이블 컨테이너가 visible인지 확인
 * - 로딩 스피너가 사라질 때까지 대기 (로딩 완료)
 */
Then("목록 페이지의 테이블이 표시된다", async ({ page }) => {
  const listTable = page.getByTestId(SELECTOR.LIST_TABLE);
  await expect(listTable).toBeVisible({ timeout: 10000 });

  // 로딩 완료 대기: 스피너 소멸
  const spinner = listTable.locator(".ant-spin");
  await expect(spinner).toBeHidden({ timeout: 10000 });
});

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
 */
Then("목록 페이지의 페이지네이션이 표시된다", async ({ page }) => {
  const pagination = page.getByTestId(SELECTOR.LIST_PAGINATION);
  await expect(pagination).toBeVisible();
});

// ============================================
// 검색 입력
// ============================================

/**
 * 목록 페이지의 검색창이 빈 값으로 표시되는지 검증
 */
Then("목록 페이지의 검색창이 빈 값으로 표시된다", async ({ page }) => {
  const searchInput = page.getByTestId(SELECTOR.LIST_SEARCH_INPUT);
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toHaveValue("");
});

/**
 * 목록 페이지의 검색창에 검색어 입력
 */
When(
  "목록 페이지의 검색창에 {string}를 입력한다",
  async ({ page }, searchText: string) => {
    const searchInput = page.getByTestId(SELECTOR.LIST_SEARCH_INPUT);
    await searchInput.fill(searchText);
    await searchInput.press("Enter");
  },
);

// ============================================
// 내 항목만 보기 스위치
// ============================================

/**
 * 목록 페이지의 "내 항목만 보기" 스위치 상태 검증
 * - 선택됨: 스위치가 체크 상태
 * - 선택되지 않음: 스위치가 체크 해제 상태
 */
Then(
  /^목록 페이지의 내 항목만 보기가 (선택되어 있다|선택되어 있지 않다)$/,
  async ({ page }, state: string) => {
    const myItemsSwitch = page.getByTestId(SELECTOR.MY_ITEMS_ONLY_SWITCH);
    await expect(myItemsSwitch).toBeVisible({ timeout: 10000 });

    if (state === "선택되어 있다") {
      await expect(myItemsSwitch).toBeChecked({ timeout: 10000 });
    } else {
      await expect(myItemsSwitch).not.toBeChecked({ timeout: 10000 });
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
 */
Then(
  /^목록 페이지의 테이블에 (EMPTY|ERROR) 메시지가 표시된다$/,
  async ({ page }, messageType: keyof typeof TABLE_MESSAGE) => {
    const listTable = page.getByTestId(SELECTOR.LIST_TABLE);
    const emptyPlaceholder = listTable.locator(".ant-table-placeholder");
    await expect(emptyPlaceholder).toBeVisible({ timeout: 10000 });

    const expectedMessage = TABLE_MESSAGE[messageType];
    await expect(emptyPlaceholder).toContainText(expectedMessage);
  },
);
