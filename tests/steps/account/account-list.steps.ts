import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  ACCOUNT_SELECTOR,
  SELECTOR,
  testId,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { AccountManagementPage } from "../../pages/account-management.page";
import { COUNT_PATTERN, DATE_PATTERN } from "../../support/patterns";

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
// 5. 검색 결과 검증
// ============================================

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
// 6. 정렬 기능
// ============================================

/** 한글 정렬 기준 → 셀 selector 매핑 */
const SORT_CELL_MAP: Record<string, string> = {
  이름: ACCOUNT_SELECTOR.NAME,
  가입일: ACCOUNT_SELECTOR.CREATED_AT,
};

When(
  "계정 목록을 {string} 기준 {string}으로 정렬한다",
  async (
    { accountManagementPage },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    await accountManagementPage.table.sortByColumn(field, order);
  },
);

Then(
  "계정 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
  async (
    { accountManagementPage, assertLogger },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    const cellSelector = SORT_CELL_MAP[field];
    if (!cellSelector) {
      throw new Error(`알 수 없는 정렬 필드: ${field}`);
    }

    // 로딩 완료 대기
    await accountManagementPage.table.waitForLoaded();

    // 실제 데이터 정렬 순서 검증
    const compareType = field === "가입일" ? "date" : "string";
    await accountManagementPage.table.assertDataSortOrder(
      cellSelector,
      order,
      assertLogger,
      compareType,
    );
  },
);

// ============================================
// 7. 계정 상세 모달 검증
// ============================================

/** 모달 필드 설정 타입 */
type ModalFieldConfig = {
  textFields: Record<string, string>;
  countFields: Record<string, string>;
  modalName: string;
};

/** 상세 모달 필드 설정 */
const DETAIL_MODAL_CONFIG: ModalFieldConfig = {
  textFields: {
    이름: ACCOUNT_SELECTOR.DETAIL_NAME,
    이메일: ACCOUNT_SELECTOR.DETAIL_EMAIL,
    그룹: ACCOUNT_SELECTOR.DETAIL_GROUP,
    상태: ACCOUNT_SELECTOR.DETAIL_STATUS,
    권한: ACCOUNT_SELECTOR.DETAIL_ROLE,
    가입일: ACCOUNT_SELECTOR.DETAIL_CREATED_AT,
  },
  countFields: {
    "워크스페이스 보유 개수": ACCOUNT_SELECTOR.DETAIL_WORKSPACE_COUNT,
    "워크스페이스 생성 제한 개수": ACCOUNT_SELECTOR.DETAIL_WORKSPACE_LIMIT,
  },
  modalName: "상세",
};

/** 수정 모달 필드 설정 */
const UPDATE_MODAL_CONFIG: ModalFieldConfig = {
  textFields: {
    이름: ACCOUNT_SELECTOR.UPDATE_NAME,
    이메일: ACCOUNT_SELECTOR.UPDATE_EMAIL,
    그룹: ACCOUNT_SELECTOR.UPDATE_GROUP,
    가입일: ACCOUNT_SELECTOR.UPDATE_CREATED_AT,
  },
  countFields: {
    "워크스페이스 보유 개수": ACCOUNT_SELECTOR.UPDATE_WORKSPACE_COUNT,
  },
  modalName: "수정",
};

/** 모달 필드 검증 헬퍼 (DRY) */
const assertModalFieldVisible = async (
  page: import("@playwright/test").Page,
  fieldName: string,
  config: ModalFieldConfig,
) => {
  const textSelector = config.textFields[fieldName];
  const countSelector = config.countFields[fieldName];

  if (textSelector) {
    // 텍스트 필드: 값이 표시되어야 함 (빈 값 아님)
    // Note: "-"는 값이 없는 경우 유효한 값 (예: 그룹이 없는 계정)
    const element = page.locator(testId(textSelector));
    await expect(element).toBeVisible();
    await expect(element).not.toBeEmpty();
  } else if (countSelector) {
    // 개수 필드: n개 형식으로 표시되어야 함
    const element = page.locator(testId(countSelector));
    await expect(element).toBeVisible();
    await expect(element).toHaveText(COUNT_PATTERN);
  } else {
    throw new Error(`알 수 없는 ${config.modalName} 모달 필드: ${fieldName}`);
  }
};

Then(
  /^계정 상세 모달에 (.+)(?:이|가) 표시된다$/,
  async ({ page }, fieldName: string) => {
    await assertModalFieldVisible(page, fieldName, DETAIL_MODAL_CONFIG);
  },
);

// ============================================
// 8. 계정 수정 모달 검증
// ============================================

Then(
  /^계정 수정 모달에 (.+)(?:이|가) 표시된다$/,
  async ({ page }, fieldName: string) => {
    await assertModalFieldVisible(page, fieldName, UPDATE_MODAL_CONFIG);
  },
);

// ============================================
// 9. 계정 수정 모달 - 폼 필드 검증
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
// 10. 패스워드 초기화 결과 모달 검증
// ============================================

Then(
  "패스워드 초기화 결과 모달에 새 패스워드가 표시된다",
  async ({ accountManagementPage }) => {
    await accountManagementPage.assertResetPasswordResultNotEmpty();
  },
);

// ============================================
// 11. 체크박스 및 삭제 기능
// ============================================

When(
  "첫 번째 계정의 체크박스를 클릭한다",
  async ({ accountManagementPage }) => {
    await accountManagementPage.table.clickRowCheckbox(0);
  },
);
