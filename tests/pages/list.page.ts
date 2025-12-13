import { expect, type Locator } from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { DataTableComponent } from "../components/data-table.component";
import { PaginationComponent } from "../components/pagination.component";
import { BasePage } from "./base.page";

/**
 * 목록 페이지의 기본 클래스
 *
 * BasePage를 상속하여 목록 페이지 공통 기능 제공:
 * - searchInput: 검색 입력창
 * - totalCount: 총 개수 표시
 * - listTable: 목록 테이블
 * - pagination: 페이지네이션
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
  /** 페이지네이션 컴포넌트 (lazy initialization) */
  private _pagination: PaginationComponent | null = null;

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
      this._table = new DataTableComponent(this.page, this.tableIdentifierTestId);
    }
    return this._table;
  }

  /** 페이지네이션 컴포넌트 */
  get pagination(): PaginationComponent {
    if (!this._pagination) {
      this._pagination = new PaginationComponent(this.page, SELECTOR.LIST_PAGINATION);
    }
    return this._pagination;
  }

  // ============================================
  // Locators
  // ============================================

  /** 검색 입력창 */
  get searchInput(): Locator {
    return this.page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
  }

  /** 총 개수 표시 영역 */
  get totalCount(): Locator {
    return this.page.locator(testId(SELECTOR.LIST_TOTAL_COUNT));
  }

  /** 목록 테이블 */
  get listTable(): Locator {
    return this.page.locator(testId(SELECTOR.LIST_TABLE));
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 목록 테이블이 표시되었는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertTableVisible(timeout = 10000): Promise<void> {
    await expect(this.listTable).toBeVisible({ timeout });
  }

  /**
   * 페이지네이션이 표시되었는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertPaginationVisible(timeout = 10000): Promise<void> {
    await expect(
      this.page.locator(testId(SELECTOR.LIST_PAGINATION)),
    ).toBeVisible({ timeout });
  }

  /**
   * 검색창이 빈 값으로 표시되었는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertSearchInputEmpty(timeout = 10000): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout });
    await expect(this.searchInput).toHaveValue("");
  }

  /**
   * 총 개수 텍스트 반환
   * @param timeout - 대기 시간 (기본 10초)
   * @returns 총 개수 텍스트 (예: "총 100개")
   */
  async getTotalCountText(timeout = 10000): Promise<string> {
    await expect(this.totalCount).toBeVisible({ timeout });
    return (await this.totalCount.textContent()) ?? "";
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 검색어 입력 및 검색 실행
   * @param searchText - 검색어
   */
  async search(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 검색창의 현재 값 반환
   * @returns 검색창 입력값
   */
  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }
}
