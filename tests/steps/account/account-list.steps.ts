import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import { ACCOUNT_SELECTOR, testId } from "@/shared/constants/selector.constant";
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
 * 5. 계정 상세 모달 검증
 * 6. 계정 수정 모달 검증
 * 7. 계정 수정 모달 - 폼 필드 검증
 * 8. 패스워드 초기화 결과 모달 검증
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

When("첫 번째 계정의 이름을 클릭한다", async ({ accountManagementPage }) => {
  await accountManagementPage.table.clickFirstCell(ACCOUNT_SELECTOR.NAME);
});

When(
  /^첫 번째 계정의 (수정|PW 초기화) 버튼을 클릭한다$/,
  async ({ accountManagementPage }, buttonName: string) => {
    const firstRow = await accountManagementPage.table.getRow(0);
    await accountManagementPage.table.clickRowButton(
      firstRow,
      AccountManagementPage.ROW_BUTTON[buttonName],
    );
  },
);

When(
  "첫 번째 계정의 상태 스위치를 클릭한다",
  async ({ accountManagementPage }) => {
    const firstRow = await accountManagementPage.table.getRow(0);
    const statusSwitch = firstRow.locator(testId(ACCOUNT_SELECTOR.STATUS));
    await statusSwitch.click();
  },
);

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
// 5. 계정 상세 모달 검증
// ============================================

Then(
  /^계정 상세 모달에 (.+)(?:이|가) 표시된다$/,
  async ({ accountManagementPage }, fieldName: string) => {
    await accountManagementPage.assertDetailModalFieldVisible(fieldName);
  },
);

// ============================================
// 6. 계정 수정 모달 검증
// ============================================

Then(
  /^계정 수정 모달에 (.+)(?:이|가) 표시된다$/,
  async ({ accountManagementPage }, fieldName: string) => {
    await accountManagementPage.assertUpdateModalFieldVisible(fieldName);
  },
);

// ============================================
// 7. 계정 수정 모달 - 폼 필드 검증
// ============================================

Then(
  "계정 수정 모달의 권한 드롭다운에 선택된 값이 다음 중 하나이다:",
  async ({ accountManagementPage }, dataTable: DataTable) => {
    const validOptions = dataTable.raw().slice(1).flat();
    await accountManagementPage.assertUpdateRoleDropdownValueIsOneOf(
      validOptions,
    );
  },
);

Then(
  "계정 수정 모달의 상태 드롭다운에 선택된 값이 다음 중 하나이다:",
  async ({ accountManagementPage }, dataTable: DataTable) => {
    const validOptions = dataTable.raw().slice(1).flat();
    await accountManagementPage.assertUpdateStatusDropdownValueIsOneOf(
      validOptions,
    );
  },
);

Then(
  "계정 수정 모달의 워크스페이스 생성 제한 개수 입력창에 숫자가 입력되어 있다",
  async ({ accountManagementPage }) => {
    await accountManagementPage.assertUpdateWorkspaceLimitFieldHasValidValue();
  },
);

// ============================================
// 8. 패스워드 초기화 결과 모달 검증
// ============================================

Then(
  "패스워드 초기화 결과 모달에 새 패스워드가 표시된다",
  async ({ accountManagementPage }) => {
    await accountManagementPage.assertResetPasswordResultNotEmpty();
  },
);
