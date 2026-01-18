import { createBdd } from "playwright-bdd";

import { ACCOUNT_PENDING_SELECTOR } from "@/shared/constants/selector.constant";
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
