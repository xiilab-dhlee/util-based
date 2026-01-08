import { expect } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import {
  ACCOUNT_PENDING_SELECTOR,
  testId,
} from "@/shared/constants/selector.constant";
import { ListPage } from "./list.page";

/**
 * 가입 승인 목록 페이지 Page Object
 *
 * ListPage를 상속하여 가입 승인 목록 페이지 전용 기능 제공:
 * - table: 가입 승인 목록 테이블 (ListPage에서 상속)
 * - 반려/승인 버튼 (행/필터)
 * - 체크박스 선택 기반 멀티 액션
 *
 * 상속 계층: BasePage > ListPage > AccountPendingPage
 */
export class AccountPendingPage extends ListPage {
  // ============================================
  // 도메인 상수 (Static)
  // ============================================

  /** 목록 페이지 행 버튼 셀렉터 */
  static readonly ROW_BUTTON: Record<string, string> = {
    반려: ACCOUNT_PENDING_SELECTOR.REJECT_BUTTON,
    승인: ACCOUNT_PENDING_SELECTOR.APPROVE_BUTTON,
  };

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    // 계정 관리 layout을 공유하므로 동일한 pageKey 사용
    return "admin.account-management";
  }

  protected get basePath(): string {
    return ROUTES.ADMIN_ACCOUNT_MANAGEMENT_PENDING;
  }

  protected get tableIdentifierTestId(): string {
    return ACCOUNT_PENDING_SELECTOR.NAME;
  }

  // ============================================
  // 필터 영역 버튼 (멀티 선택용)
  // ============================================

  /** 반려 버튼 (필터 영역) */
  get filterRejectButton() {
    return this.page.locator(
      testId(ACCOUNT_PENDING_SELECTOR.FILTER_REJECT_BUTTON),
    );
  }

  /** 승인 버튼 (필터 영역) */
  get filterApproveButton() {
    return this.page.locator(
      testId(ACCOUNT_PENDING_SELECTOR.FILTER_APPROVE_BUTTON),
    );
  }

  /** 반려 버튼 클릭 (필터 영역) */
  async clickFilterRejectButton(): Promise<void> {
    await this.filterRejectButton.click();
  }

  /** 승인 버튼 클릭 (필터 영역) */
  async clickFilterApproveButton(): Promise<void> {
    await this.filterApproveButton.click();
  }

  /** 반려 버튼 활성화 상태 검증 */
  async assertFilterRejectButtonEnabled(): Promise<void> {
    await expect(this.filterRejectButton).toBeEnabled();
  }

  /** 반려 버튼 비활성화 상태 검증 */
  async assertFilterRejectButtonDisabled(): Promise<void> {
    await expect(this.filterRejectButton).toBeDisabled();
  }

  /** 승인 버튼 활성화 상태 검증 */
  async assertFilterApproveButtonEnabled(): Promise<void> {
    await expect(this.filterApproveButton).toBeEnabled();
  }

  /** 승인 버튼 비활성화 상태 검증 */
  async assertFilterApproveButtonDisabled(): Promise<void> {
    await expect(this.filterApproveButton).toBeDisabled();
  }
}
