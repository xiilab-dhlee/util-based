import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Ant Design Select 드롭다운 Component Object (험블 객체)
 *
 * Ant Design Select 컴포넌트 조작을 캡슐화
 * - 옵션 선택
 * - 현재 값 확인
 * - placeholder 상태 확인
 *
 * @example
 * const filter = new FilterDropdownComponent(page, WORKLOAD_SELECTOR.FILTER_JOB_TYPE);
 * await filter.select("Batch");
 * const isEmpty = await filter.isEmpty();
 */
export class FilterDropdownComponent {
  constructor(
    private page: Page,
    private filterTestId: string,
  ) {}

  /**
   * 필터 요소 Locator
   */
  private get filter(): Locator {
    return this.page.locator(testId(this.filterTestId));
  }

  /**
   * 드롭다운에서 옵션 선택
   *
   * @param option - 선택할 옵션 라벨
   */
  async select(option: string): Promise<void> {
    await this.filter.click();
    await this.page
      .locator(".ant-select-dropdown:visible .ant-select-item-option-content", {
        hasText: option,
      })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 필터가 비어있는지 확인 (placeholder 표시 여부)
   *
   * @returns placeholder가 보이면 true (빈 상태)
   */
  async isEmpty(): Promise<boolean> {
    const placeholder = this.filter.locator(
      ".ant-select-selection-placeholder",
    );
    return await placeholder.isVisible();
  }

  /**
   * 현재 선택된 값 반환
   *
   * @returns 선택된 값, 없으면 null
   */
  async getSelectedValue(): Promise<string | null> {
    const selectedItem = this.filter.locator(".ant-select-selection-item");

    if (await selectedItem.isVisible()) {
      return await selectedItem.textContent();
    }

    return null;
  }

  /**
   * 필터가 특정 텍스트를 포함하는지 확인
   *
   * @param text - 확인할 텍스트
   */
  async containsText(text: string): Promise<boolean> {
    const filterText = await this.filter.textContent();
    return filterText?.includes(text) ?? false;
  }

  /**
   * 필터가 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.filter).toBeVisible({ timeout });
  }

  /**
   * 필터가 특정 텍스트를 포함하는지 단언
   *
   * @param text - 포함해야 할 텍스트
   */
  async assertContainsText(text: string): Promise<void> {
    await expect(this.filter).toContainText(text);
  }

  /**
   * 필터가 비어있는지 단언 (placeholder 표시)
   */
  async assertEmpty(): Promise<void> {
    await this.assertVisible();
    const placeholder = this.filter.locator(
      ".ant-select-selection-placeholder",
    );
    await expect(placeholder).toBeVisible();
  }
}
