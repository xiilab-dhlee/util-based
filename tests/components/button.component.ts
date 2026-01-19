import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR, testId } from "@/shared/constants/selector.constant";

/** Ant Design Button 컴포넌트 */
export class ButtonComponent {
  constructor(
    private page: Page,
    private buttonTestId: string,
  ) {}

  private get locator(): Locator {
    return this.page.locator(testId(this.buttonTestId));
  }

  /** 버튼 클릭 */
  async click(): Promise<void> {
    await this.locator.click();
  }

  /** 버튼 더블 클릭 */
  async dblclick(): Promise<void> {
    await this.locator.dblclick();
  }

  /** 버튼에 호버 */
  async hover(): Promise<void> {
    await this.locator.hover();
  }

  /** 버튼에 포커스 */
  async focus(): Promise<void> {
    await this.locator.focus();
  }

  /** 버튼 텍스트 반환 */
  async getText(): Promise<string | null> {
    return await this.locator.textContent();
  }

  /** 버튼이 활성화되어 있는지 확인 */
  async isEnabled(): Promise<boolean> {
    return await this.locator.isEnabled();
  }

  /** 버튼이 비활성화되어 있는지 확인 */
  async isDisabled(): Promise<boolean> {
    return await this.locator.isDisabled();
  }

  /** 버튼이 로딩 상태인지 확인 */
  async isLoading(): Promise<boolean> {
    const cls = await this.locator.getAttribute("class");
    return cls?.includes(ANT_SELECTOR.BTN_LOADING) ?? false;
  }

  /** 버튼이 표시되는지 검증 */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }

  /** 버튼이 숨겨져 있는지 검증 */
  async assertHidden(): Promise<void> {
    await expect(this.locator).not.toBeVisible();
  }

  /** 버튼이 활성화 상태인지 검증 */
  async assertEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  /** 버튼이 비활성화 상태인지 검증 */
  async assertDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }

  /** 버튼에 특정 텍스트가 포함되어 있는지 검증 */
  async assertContainsText(text: string): Promise<void> {
    await expect(this.locator).toContainText(text);
  }

  /** 버튼이 로딩 상태인지 검증 */
  async assertLoading(): Promise<void> {
    await expect(this.locator).toHaveClass(
      new RegExp(ANT_SELECTOR.BTN_LOADING),
    );
  }

  /** 버튼이 로딩 상태가 아닌지 검증 */
  async assertNotLoading(): Promise<void> {
    await expect(this.locator).not.toHaveClass(
      new RegExp(ANT_SELECTOR.BTN_LOADING),
    );
  }

  /** 버튼이 포커스 상태인지 검증 */
  async assertFocused(): Promise<void> {
    await expect(this.locator).toBeFocused();
  }
}
