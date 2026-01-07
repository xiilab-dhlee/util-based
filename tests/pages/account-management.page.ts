import type { Page } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
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

  constructor(page: Page) {
    super(page);
  }

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
}
