import { expect } from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { DataTableComponent } from "../components/data-table.component";
import { BasePage } from "./base.page";

/**
 * 목록 페이지의 기본 클래스 (테이블 기반)
 *
 * BasePage를 상속하여 테이블 목록 페이지 공통 기능 제공:
 * - table: 목록 테이블 컴포넌트 (도메인별 식별자 사용)
 *
 * NOTE: 검색 입력창은 listSearchInput fixture를 사용
 *
 * SOLID - Liskov Substitution: BasePage를 대체 가능
 * SOLID - Single Responsibility: 테이블 목록 페이지 공통 동작만 담당
 *
 * @example
 * class WorkloadListPage extends ListPage {
 *   protected get pageHeaderTestId() { return "workload-list-header"; }
 *   protected get basePath() { return "/user/workload"; }
 *   protected get tableIdentifierTestId() { return "workload-name"; }
 * }
 */
export abstract class ListPage extends BasePage {
  /** 목록 테이블 컴포넌트 (lazy initialization) */
  private _table: DataTableComponent | null = null;

  // ============================================
  // Abstract - 하위 클래스에서 구현 필수
  // ============================================

  /** 테이블 행 식별자 testId (하위 클래스에서 정의) */
  protected abstract get tableIdentifierTestId(): string;

  // ============================================
  // Lazy Initialized Components
  // ============================================

  /** 목록 테이블 컴포넌트 */
  get table(): DataTableComponent {
    if (!this._table) {
      this._table = new DataTableComponent(
        this.page,
        this.tableIdentifierTestId,
      );
    }
    return this._table;
  }

  // ============================================
  // 삭제 버튼 (공통)
  // ============================================

  /** 삭제 버튼 Locator */
  get deleteButton() {
    return this.page.locator(testId(SELECTOR.LIST_DELETE_BUTTON));
  }

  /** 삭제 버튼 클릭 */
  async clickDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  /** 삭제 버튼 활성화 상태 검증 */
  async assertDeleteButtonEnabled(): Promise<void> {
    await expect(this.deleteButton).toBeEnabled();
  }

  /** 삭제 버튼 비활성화 상태 검증 */
  async assertDeleteButtonDisabled(): Promise<void> {
    await expect(this.deleteButton).toBeDisabled();
  }
}
