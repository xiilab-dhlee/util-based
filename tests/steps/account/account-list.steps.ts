import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  ACCOUNT_SELECTOR,
  SELECTOR,
  testId,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { AccountManagementPage } from "../../pages/account-management.page";
import { DATE_PATTERN } from "../../support/patterns";

/**
 * 계정 관리 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 페이지 표시 검증
 * 3. 테이블 행 액션
 * 4. 데이터 유효성 검증
 *
 * 도메인 상수: AccountManagementPage.ROW_BUTTON
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("계정 관리 목록 페이지에 있다", async ({ accountManagementPage }) => {
  await accountManagementPage.goto();
});

When("계정 관리 목록 페이지로 이동한다", async ({ accountManagementPage }) => {
  await accountManagementPage.goto();
});

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("계정 관리 목록 페이지가 표시된다", async ({ accountManagementPage }) => {
  await accountManagementPage.assertPageVisible();
});

// ============================================
// 3. 테이블 행 액션
// ============================================

When(
  "첫 번째 계정의 이름을 클릭한다",
  async ({ accountManagementPage, $testInfo }) => {
    const count = await accountManagementPage.table.getRowCount();
    if (count === 0) {
      $testInfo.skip(true, "계정이 없어 시나리오를 스킵합니다");
      return;
    }
    await accountManagementPage.table.clickFirstCell(ACCOUNT_SELECTOR.NAME);
  },
);

When(
  /^첫 번째 계정의 (수정|PW 초기화) 버튼을 클릭한다$/,
  async ({ accountManagementPage, $testInfo }, buttonName: string) => {
    const count = await accountManagementPage.table.getRowCount();
    if (count === 0) {
      $testInfo.skip(true, "계정이 없어 시나리오를 스킵합니다");
      return;
    }
    const firstRow = await accountManagementPage.table.getRow(0);
    await accountManagementPage.table.clickRowButton(
      firstRow,
      AccountManagementPage.ROW_BUTTON[buttonName],
    );
  },
);

/**
 * 버튼 활성화 상태 검증
 */
Then(
  /^해당 계정의 (\S+) 버튼(?:이| 상태가) (활성화|비활성화)(?:이다|되어 있다)$/,
  async ({ listContext }, buttonName: string, state: string) => {
    const currentRow = listContext.assertCurrentRow();
    const button = currentRow.locator(
      testId(AccountManagementPage.ROW_BUTTON[buttonName]),
    );
    if (state === "활성화") {
      await expect(button).toBeEnabled();
    } else {
      await expect(button).toBeDisabled();
    }
  },
);

// ============================================
// 4. 데이터 유효성 검증
// ============================================

/**
 * 각 계정의 이름이 빈 값이 아닌지 검증
 */
Then(
  "각 계정의 이름이 빈 값이 아니다",
  async ({ accountManagementPage, assertLogger }) => {
    await accountManagementPage.table.forEachCell(
      ACCOUNT_SELECTOR.NAME,
      (text, i) => {
        assertLogger.assertNotEmpty(`계정[${i}] 이름`, text);
      },
    );
  },
);

/**
 * 각 계정의 이메일이 빈 값이 아닌지 검증
 */
Then(
  "각 계정의 이메일이 빈 값이 아니다",
  async ({ accountManagementPage, assertLogger }) => {
    await accountManagementPage.table.forEachCell(
      ACCOUNT_SELECTOR.EMAIL,
      (text, i) => {
        assertLogger.assertNotEmpty(`계정[${i}] 이메일`, text);
      },
    );
  },
);

/**
 * 각 계정의 권한이 빈 값이 아닌지 검증
 */
Then(
  "각 계정의 권한이 빈 값이 아니다",
  async ({ accountManagementPage, assertLogger }) => {
    await accountManagementPage.table.forEachCell(
      ACCOUNT_SELECTOR.ROLE,
      (text, i) => {
        assertLogger.assertNotEmpty(`계정[${i}] 권한`, text);
      },
    );
  },
);

/**
 * 각 계정의 가입일이 올바른 형식으로 표시되는지 검증
 */
Then(
  "각 계정의 가입일이 올바른 형식으로 표시된다",
  async ({ accountManagementPage, assertLogger }) => {
    await accountManagementPage.table.forEachCell(
      ACCOUNT_SELECTOR.CREATED_AT,
      (text, i) => {
        assertLogger.assertMatch(`계정[${i}] 가입일`, text, DATE_PATTERN);
      },
    );
  },
);

/**
 * 각 계정의 권한이 유효한 값 중 하나인지 검증
 */
Then(
  "각 계정의 권한이 다음 중 하나이다:",
  async ({ accountManagementPage, assertLogger }, dataTable: DataTable) => {
    const validRoles = dataTable.raw().slice(1).flat();

    await accountManagementPage.table.forEachCell(
      ACCOUNT_SELECTOR.ROLE,
      (text, i) => {
        assertLogger.assertContains(`계정[${i}] 권한`, text, validRoles);
      },
    );
  },
);

// ============================================
// 5. 검색 결과 검증
// ============================================

/**
 * 계정 검색 결과 검증
 */
Then(
  "계정 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({
    accountManagementPage,
    listSearchInput,
    assertLogger,
    $testInfo,
  }) => {
    // 테이블이 표시될 때까지 대기
    await accountManagementPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    // 검색 결과 검증
    await accountManagementPage.table.validateSearch(
      await listSearchInput.getValue(),
      ACCOUNT_SELECTOR.NAME,
      assertLogger,
      $testInfo,
      "계정",
    );
  },
);

// ============================================
// 6. 정렬 기능 (TODO: DataTableComponent에 sortByColumn 메서드 추가 후 구현)
// ============================================

// /**
//  * 한글 정렬 기준 → 영문 필드 매핑
//  */
// const SORT_FIELD_MAP: Record<string, string> = {
//   이름: "accountName",
//   가입일: "createdAt",
// };

// /**
//  * 계정 목록 정렬 설정
//  */
// When(
//   "계정 목록을 {string} 기준 {string}으로 정렬한다",
//   async ({ accountManagementPage }, field: string, order: string) => {
//     const columnSelector = SORT_FIELD_MAP[field];
//     if (!columnSelector) {
//       throw new Error(`알 수 없는 정렬 필드: ${field}`);
//     }
//
//     // 컬럼 헤더 클릭으로 정렬
//     await accountManagementPage.table.sortByColumn(columnSelector, order);
//   },
// );

// /**
//  * 계정 목록 정렬 결과 검증
//  */
// Then(
//   "계정 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
//   async ({ accountManagementPage, assertLogger }, field: string, order: string) => {
//     const columnSelector = SORT_FIELD_MAP[field];
//     if (!columnSelector) {
//       throw new Error(`알 수 없는 정렬 필드: ${field}`);
//     }
//
//     // 정렬 상태 검증
//     await accountManagementPage.table.assertSortOrder(
//       columnSelector,
//       order,
//       assertLogger,
//     );
//   },
// );
