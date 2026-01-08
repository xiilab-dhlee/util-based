import { createBdd } from "playwright-bdd";

import {
  ACCOUNT_PENDING_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { AccountPendingPage } from "../../pages/account-pending.page";
import { DATE_PATTERN } from "../../support/patterns";

const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("가입 승인 목록 페이지에 있다", async ({ accountPendingPage }) => {
  await accountPendingPage.goto();
});

When("가입 승인 목록 페이지로 이동한다", async ({ accountPendingPage }) => {
  await accountPendingPage.goto();
});

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("가입 승인 목록 페이지가 표시된다", async ({ accountPendingPage }) => {
  await accountPendingPage.assertPageVisible();
});

// ============================================
// 3. 테이블 행 액션
// ============================================

When(
  /^첫 번째 가입 신청의 (반려|승인) 버튼을 클릭한다$/,
  async ({ accountPendingPage }, buttonName: string) => {
    const firstRow = await accountPendingPage.table.getRow(0);
    await accountPendingPage.table.clickRowButton(
      firstRow,
      AccountPendingPage.ROW_BUTTON[buttonName],
    );
  },
);

When(
  "첫 번째 가입 신청의 체크박스를 클릭한다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.table.clickRowCheckbox(0);
  },
);

// ============================================
// 4. 필터 영역 버튼 (멀티 선택)
// ============================================

When(
  "가입 승인 목록의 반려 버튼을 클릭한다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.clickFilterRejectButton();
  },
);

When(
  "가입 승인 목록의 승인 버튼을 클릭한다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.clickFilterApproveButton();
  },
);

Then(
  "가입 승인 목록의 반려 버튼이 활성화 상태이다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.assertFilterRejectButtonEnabled();
  },
);

Then(
  "가입 승인 목록의 반려 버튼이 비활성화 상태이다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.assertFilterRejectButtonDisabled();
  },
);

Then(
  "가입 승인 목록의 승인 버튼이 활성화 상태이다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.assertFilterApproveButtonEnabled();
  },
);

Then(
  "가입 승인 목록의 승인 버튼이 비활성화 상태이다",
  async ({ accountPendingPage }) => {
    await accountPendingPage.assertFilterApproveButtonDisabled();
  },
);

// ============================================
// 5. 데이터 유효성 검증
// ============================================

Then(
  "각 가입 신청의 이름이 빈 값이 아니다",
  async ({ accountPendingPage, assertLogger }) => {
    await accountPendingPage.table.forEachCell(
      ACCOUNT_PENDING_SELECTOR.NAME,
      (text, i) => {
        assertLogger.assertNotEmpty(`가입 신청[${i}] 이름`, text);
      },
    );
  },
);

Then(
  "각 가입 신청의 이메일이 빈 값이 아니다",
  async ({ accountPendingPage, assertLogger }) => {
    await accountPendingPage.table.forEachCell(
      ACCOUNT_PENDING_SELECTOR.EMAIL,
      (text, i) => {
        assertLogger.assertNotEmpty(`가입 신청[${i}] 이메일`, text);
      },
    );
  },
);

Then(
  "각 가입 신청의 가입일이 올바른 형식으로 표시된다",
  async ({ accountPendingPage, assertLogger }) => {
    await accountPendingPage.table.forEachCell(
      ACCOUNT_PENDING_SELECTOR.CREATED_AT,
      (text, i) => {
        assertLogger.assertMatch(`가입 신청[${i}] 가입일`, text, DATE_PATTERN);
      },
    );
  },
);

// ============================================
// 6. 검색 결과 검증
// ============================================

Then(
  "가입 신청 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ accountPendingPage, listSearchInput, assertLogger, $testInfo }) => {
    await accountPendingPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    await accountPendingPage.table.validateSearch(
      await listSearchInput.getValue(),
      ACCOUNT_PENDING_SELECTOR.NAME,
      assertLogger,
      $testInfo,
      "가입 신청",
    );
  },
);

// ============================================
// 7. 정렬 기능
// ============================================

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
