import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Ant Design Pagination Component Object (험블 객체)
 *
 * Ant Design Pagination 컴포넌트 조작을 캡슐화
 * - 페이지 이동
 * - 현재 페이지 확인
 * - 페이지 수 확인
 *
 * @example
 * const pagination = new PaginationComponent(page, SELECTOR.LIST_PAGINATION);
 * await pagination.goToPage(2);
 * await pagination.assertCurrentPage(2);
 */
export class PaginationComponent {
  constructor(
    private page: Page,
    private paginationTestId: string,
  ) {}

  /**
   * 페이지네이션 요소 Locator
   */
  private get pagination(): Locator {
    return this.page.locator(testId(this.paginationTestId));
  }

  /**
   * 페이지네이션 표시 여부 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.pagination).toBeVisible({ timeout });
  }

  /**
   * 현재 활성 페이지 번호 반환
   *
   * @returns 현재 페이지 번호
   */
  async getCurrentPage(): Promise<number> {
    const activeItem = this.pagination.locator(".ant-pagination-item-active");
    const title = await activeItem.getAttribute("title");
    return Number.parseInt(title ?? "1", 10);
  }

  /**
   * 총 페이지 수 반환
   *
   * @returns 페이지 수
   */
  async getTotalPages(): Promise<number> {
    const pageItems = this.pagination.locator(".ant-pagination-item");
    return await pageItems.count();
  }

  /**
   * 특정 페이지로 이동
   *
   * @param pageNum - 이동할 페이지 번호
   */
  async goToPage(pageNum: number): Promise<void> {
    const targetPageItem = this.pagination.locator(
      `.ant-pagination-item-${pageNum}`,
    );

    // 이미 해당 페이지면 스킵
    const isActive = await targetPageItem.evaluate((el) =>
      el.classList.contains("ant-pagination-item-active"),
    );
    if (isActive) return;

    // 해당 페이지로 이동 (a 태그 클릭)
    await targetPageItem.locator("a").click();
    await expect(targetPageItem).toHaveClass(/ant-pagination-item-active/);
  }

  /**
   * 다음 페이지로 이동
   */
  async goToNextPage(): Promise<void> {
    const currentActive = this.pagination.locator(
      ".ant-pagination-item-active",
    );
    const currentPage = await currentActive.getAttribute("title");

    const nextButton = this.pagination.locator(".ant-pagination-next");
    await nextButton.click();

    // 현재 페이지가 active에서 해제될 때까지 대기
    await expect(
      this.pagination.locator(`.ant-pagination-item-${currentPage}`),
    ).not.toHaveClass(/ant-pagination-item-active/);
  }

  /**
   * 이전 페이지로 이동
   */
  async goToPreviousPage(): Promise<void> {
    const currentActive = this.pagination.locator(
      ".ant-pagination-item-active",
    );
    const currentPage = await currentActive.getAttribute("title");

    const prevButton = this.pagination.locator(".ant-pagination-prev");
    await prevButton.click();

    // 현재 페이지가 active에서 해제될 때까지 대기
    await expect(
      this.pagination.locator(`.ant-pagination-item-${currentPage}`),
    ).not.toHaveClass(/ant-pagination-item-active/);
  }

  /**
   * 현재 페이지 번호 검증
   *
   * @param expected - 기대하는 페이지 번호
   */
  async assertCurrentPage(expected: number): Promise<void> {
    const activePageLink = this.pagination.locator(
      ".ant-pagination-item-active a",
    );
    await expect(activePageLink).toHaveText(String(expected));
  }
}
