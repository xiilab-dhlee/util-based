import { ROUTES } from "@/shared/constants/routes.constant";
import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { CardGridComponent } from "../components/card-grid.component";
import { PaginationComponent } from "../components/pagination.component";
import { SearchInputComponent } from "../components/search-input.component";
import type { AssertLogger } from "../fixtures";
import { ListPage } from "./list.page";

/**
 * 개인 레지스트리 목록 페이지 Page Object
 *
 * ListPage를 상속하여 개인 레지스트리 목록 페이지 전용 기능 제공:
 * - table: 개인 레지스트리 목록 테이블 (ListPage에서 상속)
 * - jobListSearchInput: 등록 중인 이미지 목록 검색창
 * - jobListPagination: 등록 중인 이미지 목록 페이지네이션
 * - jobListGrid: 등록 중인 이미지 목록 카드 그리드
 *
 * 상속 계층: BasePage > ListPage > PrivateRegistryListPage
 *
 * @example
 * const privateRegistryListPage = new PrivateRegistryListPage(page);
 * await privateRegistryListPage.goto();
 * await privateRegistryListPage.table.assertRowCount(5);
 */
export class PrivateRegistryListPage extends ListPage {
  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return PRIVATE_REGISTRY_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return ROUTES.USER_PRIVATE_REGISTRY;
  }

  protected get tableIdentifierTestId(): string {
    return PRIVATE_REGISTRY_SELECTOR.IMAGE_NAME;
  }

  // ============================================
  // 등록 중인 이미지 목록 (Job List) 컴포넌트
  // ============================================

  /** 등록 중인 이미지 목록 검색창 */
  get jobListSearchInput(): SearchInputComponent {
    return new SearchInputComponent(
      this.page,
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_SEARCH_INPUT,
    );
  }

  /** 등록 중인 이미지 목록 페이지네이션 */
  get jobListPagination(): PaginationComponent {
    return new PaginationComponent(
      this.page,
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_PAGINATION,
    );
  }

  /** 등록 중인 이미지 목록 총 개수 Locator */
  get jobListTotalCount() {
    return this.page.getByTestId(
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_TOTAL_COUNT,
    );
  }

  /** 등록 중인 이미지 목록 카드 그리드 */
  get jobListGrid(): CardGridComponent {
    return new CardGridComponent(
      this.page,
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_CARD,
    );
  }

  // ============================================
  // 등록 중인 이미지 목록 검증
  // ============================================

  /**
   * 등록 중인 이미지 목록 총 개수 표시 검증
   * @param assertLogger - 검증 로거
   */
  async assertJobListTotalCountVisible(
    assertLogger: AssertLogger,
  ): Promise<void> {
    const text = (await this.jobListTotalCount.textContent()) ?? "";
    assertLogger.assertMatch(
      "등록 중인 이미지 목록 총 개수",
      text,
      /^\d+(,\d{3})*$/,
    );
  }

  /**
   * 등록 중인 이미지 목록 검색창이 빈 값인지 검증
   */
  async assertJobListSearchInputEmpty(): Promise<void> {
    await this.jobListSearchInput.assertEmpty();
  }

  /**
   * 등록 중인 이미지 목록 페이지네이션 표시 검증
   */
  async assertJobListPaginationVisible(): Promise<void> {
    await this.jobListPagination.assertVisible();
  }
}
