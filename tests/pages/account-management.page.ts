import { expect } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import { ACCOUNT_SELECTOR, testId } from "@/shared/constants/selector.constant";
import { DropdownComponent } from "../components/dropdown.component";
import { FormItemComponent } from "../components/form-item.component";
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
    await this.goto("/pending");
  }

  /**
   * 그룹 관리 페이지로 이동
   */
  async gotoGroup(): Promise<void> {
    await this.goto("/group");
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
  // 수정 모달 - 폼 필드 검증
  // ============================================

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
    const formItem = this.page.locator(
      testId(ACCOUNT_SELECTOR.UPDATE_WORKSPACE_LIMIT_FIELD),
    );
    const input = formItem.locator("input");
    await expect(input).toBeVisible();
    const value = await input.inputValue();
    expect(value).toMatch(/^\d+$/);
    expect(Number(value)).toBeGreaterThanOrEqual(1);
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
