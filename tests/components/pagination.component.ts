import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR, testId } from "@/shared/constants/selector.constant";

/** Ant Design Pagination 컴포넌트 */
export class PaginationComponent {
  constructor(
    private page: Page,
    private paginationTestId: string,
  ) {}

  private get container(): Locator {
    return this.page.locator(testId(this.paginationTestId));
  }

  private get prevButton(): Locator {
    return this.container.locator(ANT_SELECTOR.PAGINATION_PREV);
  }

  private get nextButton(): Locator {
    return this.container.locator(ANT_SELECTOR.PAGINATION_NEXT);
  }

  private get activeItem(): Locator {
    return this.container.locator(ANT_SELECTOR.PAGINATION_ITEM_ACTIVE);
  }

  private getPageItem(pageNumber: number): Locator {
    return this.container.locator(ANT_SELECTOR.paginationItem(pageNumber));
  }

  /** 특정 페이지로 이동 */
  async goToPage(pageNumber: number): Promise<void> {
    await this.getPageItem(pageNumber).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 다음 페이지로 이동 */
  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 이전 페이지로 이동 */
  async goToPrevPage(): Promise<void> {
    await this.prevButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 현재 페이지 번호 반환 */
  async getCurrentPage(): Promise<number> {
    const text = await this.activeItem.textContent();
    return parseInt(text ?? "1", 10);
  }

  /** 총 페이지 수 반환 */
  async getTotalPages(): Promise<number | null> {
    const items = this.container.locator(ANT_SELECTOR.PAGINATION_ITEM);
    const count = await items.count();
    if (count === 0) return null;

    const text = await items.last().textContent();
    return text ? parseInt(text, 10) : null;
  }

  /** 페이지네이션이 표시되는지 검증 */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
  }

  /** 페이지네이션이 숨겨져 있는지 검증 */
  async assertHidden(timeout = 10000): Promise<void> {
    await expect(this.container).toBeHidden({ timeout });
  }

  /** 현재 페이지가 특정 번호인지 검증 */
  async assertCurrentPage(
    expectedPage: number,
    timeout = 10000,
  ): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.activeItem).toHaveText(String(expectedPage));
  }

  /** 이전 페이지 버튼이 비활성화 상태인지 검증 */
  async assertPrevDisabled(timeout = 10000): Promise<void> {
    await expect(this.prevButton).toHaveClass(/ant-pagination-disabled/, {
      timeout,
    });
  }

  /** 다음 페이지 버튼이 비활성화 상태인지 검증 */
  async assertNextDisabled(timeout = 10000): Promise<void> {
    await expect(this.nextButton).toHaveClass(/ant-pagination-disabled/, {
      timeout,
    });
  }

  /** 특정 페이지 아이템이 존재하는지 검증 */
  async assertPageExists(pageNumber: number, timeout = 10000): Promise<void> {
    await expect(this.getPageItem(pageNumber)).toBeVisible({ timeout });
  }
}
