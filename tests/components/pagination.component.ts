import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Pagination Component Object (험블 객체)
 *
 * Ant Design Pagination 컴포넌트 조작을 캡슐화
 * - 페이지 이동
 * - 현재 페이지 확인
 * - 페이지네이션 상태 검증
 *
 * @example
 * const pagination = new PaginationComponent(page, "list-pagination");
 * await pagination.goToPage(2);
 * await pagination.assertVisible();
 */
export class PaginationComponent {
  constructor(
    private page: Page,
    private paginationTestId: string,
  ) {}

  /**
   * 페이지네이션 컨테이너 Locator
   */
  private get container(): Locator {
    return this.page.locator(testId(this.paginationTestId));
  }

  /**
   * 이전 페이지 버튼
   */
  private get prevButton(): Locator {
    return this.container.locator(".ant-pagination-prev");
  }

  /**
   * 다음 페이지 버튼
   */
  private get nextButton(): Locator {
    return this.container.locator(".ant-pagination-next");
  }

  /**
   * 현재 활성화된 페이지 아이템
   */
  private get activeItem(): Locator {
    return this.container.locator(".ant-pagination-item-active");
  }

  /**
   * 특정 페이지 번호 아이템
   */
  private getPageItem(pageNumber: number): Locator {
    return this.container.locator(`.ant-pagination-item-${pageNumber}`);
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 특정 페이지로 이동
   *
   * @param pageNumber - 이동할 페이지 번호
   */
  async goToPage(pageNumber: number): Promise<void> {
    const pageItem = this.getPageItem(pageNumber);
    await pageItem.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 다음 페이지로 이동
   */
  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 이전 페이지로 이동
   */
  async goToPrevPage(): Promise<void> {
    await this.prevButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 현재 페이지 번호 반환
   *
   * @returns 현재 페이지 번호
   */
  async getCurrentPage(): Promise<number> {
    const text = await this.activeItem.textContent();
    return parseInt(text ?? "1", 10);
  }

  /**
   * 총 페이지 수 반환 (가능한 경우)
   *
   * @returns 총 페이지 수 또는 null
   */
  async getTotalPages(): Promise<number | null> {
    const items = this.container.locator(".ant-pagination-item");
    const count = await items.count();
    if (count === 0) return null;

    const lastItem = items.last();
    const text = await lastItem.textContent();
    return text ? parseInt(text, 10) : null;
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 페이지네이션이 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
  }

  /**
   * 페이지네이션이 숨겨져 있는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertHidden(timeout = 10000): Promise<void> {
    await expect(this.container).toBeHidden({ timeout });
  }

  /**
   * 현재 페이지가 특정 번호인지 확인
   *
   * @param expectedPage - 기대하는 페이지 번호
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertCurrentPage(
    expectedPage: number,
    timeout = 10000,
  ): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.activeItem).toHaveText(String(expectedPage));
  }

  /**
   * 이전 페이지 버튼이 비활성화 상태인지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertPrevDisabled(timeout = 10000): Promise<void> {
    await expect(this.prevButton).toHaveClass(/ant-pagination-disabled/, {
      timeout,
    });
  }

  /**
   * 다음 페이지 버튼이 비활성화 상태인지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertNextDisabled(timeout = 10000): Promise<void> {
    await expect(this.nextButton).toHaveClass(/ant-pagination-disabled/, {
      timeout,
    });
  }

  /**
   * 특정 페이지 아이템이 존재하는지 확인
   *
   * @param pageNumber - 확인할 페이지 번호
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertPageExists(pageNumber: number, timeout = 10000): Promise<void> {
    const pageItem = this.getPageItem(pageNumber);
    await expect(pageItem).toBeVisible({ timeout });
  }
}
