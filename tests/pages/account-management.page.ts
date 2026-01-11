import { expect } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import { ACCOUNT_SELECTOR, testId } from "@/shared/constants/selector.constant";
import { DropdownComponent } from "../components/dropdown.component";
import { FormItemComponent } from "../components/form-item.component";
import { COUNT_PATTERN } from "../support/patterns";
import { ListPage } from "./list.page";

/**
 * 계정 관리 목록 페이지 Page Object
 *
 * ListPage를 상속하여 계정 관리 목록 페이지 전용 기능 제공:
 * - table: 계정 목록 테이블 (ListPage에서 상속)
 *
 * 상속 계층: BasePage > ListPage > AccountManagementPage
 *
 * @example
 * const accountManagementPage = new AccountManagementPage(page);
 * await accountManagementPage.goto();
 * await accountManagementPage.table.assertRowCount(5);
 */
export class AccountManagementPage extends ListPage {
  // ============================================
  // 도메인 상수 (Static)
  // ============================================

  /** 목록 페이지 행 버튼 셀렉터 */
  static readonly ROW_BUTTON: Record<string, string> = {
    수정: ACCOUNT_SELECTOR.UPDATE_BUTTON,
    "PW 초기화": ACCOUNT_SELECTOR.RESET_PASSWORD_BUTTON,
  };

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return ACCOUNT_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return ROUTES.ADMIN_ACCOUNT_MANAGEMENT;
  }

  protected get tableIdentifierTestId(): string {
    return ACCOUNT_SELECTOR.NAME;
  }

  // ============================================
  // Navigation (확장)
  // ============================================

  /**
   * 승인 대기 계정 목록 페이지로 이동
   */
  async gotoPending(): Promise<void> {
    await this.page.goto(ROUTES.ADMIN_ACCOUNT_MANAGEMENT_PENDING);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 그룹 관리 페이지로 이동
   */
  async gotoGroup(): Promise<void> {
    await this.page.goto(ROUTES.ADMIN_ACCOUNT_MANAGEMENT_GROUP);
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // 수정 모달 - 폼 필드 컴포넌트
  // ============================================

  /** 수정 모달 - 워크스페이스 생성 제한 개수 필드 */
  get updateWorkspaceLimitField(): FormItemComponent {
    return new FormItemComponent(
      this.page,
      ACCOUNT_SELECTOR.UPDATE_WORKSPACE_LIMIT_FIELD,
    );
  }

  /** 수정 모달 - 권한 드롭다운 */
  get updateRoleDropdown(): DropdownComponent {
    return new DropdownComponent(this.page, ACCOUNT_SELECTOR.UPDATE_ROLE_FIELD);
  }

  /** 수정 모달 - 상태 드롭다운 */
  get updateStatusDropdown(): DropdownComponent {
    return new DropdownComponent(
      this.page,
      ACCOUNT_SELECTOR.UPDATE_STATUS_FIELD,
    );
  }

  // ============================================
  // 상세 모달 필드 설정
  // ============================================

  /** 상세 모달 텍스트 필드 셀렉터 */
  private static readonly DETAIL_TEXT_FIELDS: Record<string, string> = {
    이름: ACCOUNT_SELECTOR.DETAIL_NAME,
    이메일: ACCOUNT_SELECTOR.DETAIL_EMAIL,
    그룹: ACCOUNT_SELECTOR.DETAIL_GROUP,
    상태: ACCOUNT_SELECTOR.DETAIL_STATUS,
    권한: ACCOUNT_SELECTOR.DETAIL_ROLE,
    가입일: ACCOUNT_SELECTOR.DETAIL_CREATED_AT,
  };

  /** 상세 모달 개수 필드 셀렉터 */
  private static readonly DETAIL_COUNT_FIELDS: Record<string, string> = {
    "워크스페이스 보유 개수": ACCOUNT_SELECTOR.DETAIL_WORKSPACE_COUNT,
    "워크스페이스 생성 제한 개수": ACCOUNT_SELECTOR.DETAIL_WORKSPACE_LIMIT,
  };

  // ============================================
  // 수정 모달 필드 설정
  // ============================================

  /** 수정 모달 텍스트 필드 셀렉터 */
  private static readonly UPDATE_TEXT_FIELDS: Record<string, string> = {
    이름: ACCOUNT_SELECTOR.UPDATE_NAME,
    이메일: ACCOUNT_SELECTOR.UPDATE_EMAIL,
    그룹: ACCOUNT_SELECTOR.UPDATE_GROUP,
    가입일: ACCOUNT_SELECTOR.UPDATE_CREATED_AT,
  };

  /** 수정 모달 개수 필드 셀렉터 */
  private static readonly UPDATE_COUNT_FIELDS: Record<string, string> = {
    "워크스페이스 보유 개수": ACCOUNT_SELECTOR.UPDATE_WORKSPACE_COUNT,
  };

  // ============================================
  // 상세 모달 - 필드 검증
  // ============================================

  /**
   * 상세 모달의 필드가 올바르게 표시되는지 검증
   *
   * @param fieldName - 필드명 (이름, 이메일, 그룹, 상태, 권한, 가입일, 워크스페이스 보유 개수 등)
   */
  async assertDetailModalFieldVisible(fieldName: string): Promise<void> {
    await this.assertModalFieldVisible(
      fieldName,
      AccountManagementPage.DETAIL_TEXT_FIELDS,
      AccountManagementPage.DETAIL_COUNT_FIELDS,
      "상세",
    );
  }

  // ============================================
  // 수정 모달 - 필드 검증
  // ============================================

  /**
   * 수정 모달의 필드가 올바르게 표시되는지 검증
   *
   * @param fieldName - 필드명 (이름, 이메일, 그룹, 가입일, 워크스페이스 보유 개수)
   */
  async assertUpdateModalFieldVisible(fieldName: string): Promise<void> {
    await this.assertModalFieldVisible(
      fieldName,
      AccountManagementPage.UPDATE_TEXT_FIELDS,
      AccountManagementPage.UPDATE_COUNT_FIELDS,
      "수정",
    );
  }

  /**
   * 수정 모달의 권한 드롭다운에 선택된 값이 유효한 옵션 목록에 포함되는지 검증
   *
   * @param validOptions - 유효한 옵션 목록
   */
  async assertUpdateRoleDropdownValueIsOneOf(
    validOptions: string[],
  ): Promise<void> {
    await this.updateRoleDropdown.assertSelectedValueIsOneOf(validOptions);
  }

  /**
   * 수정 모달의 상태 드롭다운에 선택된 값이 유효한 옵션 목록에 포함되는지 검증
   *
   * @param validOptions - 유효한 옵션 목록
   */
  async assertUpdateStatusDropdownValueIsOneOf(
    validOptions: string[],
  ): Promise<void> {
    await this.updateStatusDropdown.assertSelectedValueIsOneOf(validOptions);
  }

  /**
   * 수정 모달의 워크스페이스 생성 제한 개수 입력창에 숫자가 입력되어 있는지 검증
   */
  async assertUpdateWorkspaceLimitFieldHasValidValue(): Promise<void> {
    await this.updateWorkspaceLimitField.assertVisible();
    await expect(
      this.updateWorkspaceLimitField.getInputLocator(),
    ).toBeVisible();
    const value = await this.updateWorkspaceLimitField.getInputValue();
    expect(value).toMatch(/^\d+$/);
    expect(Number(value)).toBeGreaterThanOrEqual(1);
  }

  // ============================================
  // Private 헬퍼
  // ============================================

  /**
   * 모달 필드 검증 공통 로직
   */
  private async assertModalFieldVisible(
    fieldName: string,
    textFields: Record<string, string>,
    countFields: Record<string, string>,
    modalName: string,
  ): Promise<void> {
    const textSelector = textFields[fieldName];
    const countSelector = countFields[fieldName];

    if (textSelector) {
      // 텍스트 필드: 값이 표시되어야 함 (빈 값 아님)
      // Note: "-"는 값이 없는 경우 유효한 값 (예: 그룹이 없는 계정)
      const element = this.page.locator(testId(textSelector));
      await expect(element).toBeVisible();
      await expect(element).not.toBeEmpty();
    } else if (countSelector) {
      // 개수 필드: n개 형식으로 표시되어야 함
      const element = this.page.locator(testId(countSelector));
      await expect(element).toBeVisible();
      await expect(element).toHaveText(COUNT_PATTERN);
    } else {
      throw new Error(`알 수 없는 ${modalName} 모달 필드: ${fieldName}`);
    }
  }

  // ============================================
  // 패스워드 초기화 결과 모달 검증
  // ============================================

  /**
   * 패스워드 초기화 결과 모달의 새 패스워드가 비어있지 않은지 검증
   */
  async assertResetPasswordResultNotEmpty(): Promise<void> {
    const passwordElement = this.page.locator(
      testId(ACCOUNT_SELECTOR.RESET_PASSWORD_RESULT),
    );
    await expect(passwordElement).toBeVisible();
    const password = await passwordElement.textContent();
    expect(password?.trim()).not.toBe("");
  }
}
