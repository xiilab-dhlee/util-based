import type { Locator } from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { DataTableComponent } from "../components/data-table.component";
import { BasePage } from "./base.page";

/**
 * 목록 페이지의 기본 클래스
 *
 * BasePage를 상속하여 목록 페이지 공통 기능 제공:
 * - table: 목록 테이블 컴포넌트
 * - searchInput: 검색 입력창
 *
 * SOLID - Liskov Substitution: BasePage를 대체 가능
 * SOLID - Single Responsibility: 목록 페이지 공통 동작만 담당
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
  // Locators
  // ============================================

  /** 검색 입력창 */
  get searchInput(): Locator {
    return this.page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 검색창의 현재 값 반환
   * @returns 검색창 입력값
   */
  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }
}
