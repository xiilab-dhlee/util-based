import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Button Component Object (험블 객체)
 *
 * Ant Design Button 및 일반 버튼 컴포넌트 조작을 캡슐화
 * - 클릭 동작
 * - 활성화/비활성화 상태 확인
 * - 로딩 상태 확인
 *
 * @example
 * const submitButton = new ButtonComponent(page, AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON);
 * await submitButton.click();
 * await submitButton.assertEnabled();
 */
export class ButtonComponent {
  constructor(
    private page: Page,
    private buttonTestId: string,
  ) {}

  /**
   * 버튼 요소 Locator
   */
  private get locator(): Locator {
    return this.page.locator(testId(this.buttonTestId));
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 버튼 클릭
   */
  async click(): Promise<void> {
    await this.locator.click();
  }

  /**
   * 버튼 더블 클릭
   */
  async dblclick(): Promise<void> {
    await this.locator.dblclick();
  }

  /**
   * 버튼에 호버
   */
  async hover(): Promise<void> {
    await this.locator.hover();
  }

  /**
   * 버튼에 포커스
   */
  async focus(): Promise<void> {
    await this.locator.focus();
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 버튼 텍스트 반환
   */
  async getText(): Promise<string | null> {
    return await this.locator.textContent();
  }

  /**
   * 버튼이 활성화되어 있는지 확인
   */
  async isEnabled(): Promise<boolean> {
    return await this.locator.isEnabled();
  }

  /**
   * 버튼이 비활성화되어 있는지 확인
   */
  async isDisabled(): Promise<boolean> {
    return await this.locator.isDisabled();
  }

  /**
   * 버튼이 로딩 상태인지 확인 (Ant Design)
   */
  async isLoading(): Promise<boolean> {
    const loadingClass = await this.locator.getAttribute("class");
    return loadingClass?.includes("ant-btn-loading") ?? false;
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 버튼이 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }

  /**
   * 버튼이 숨겨져 있는지 확인
   */
  async assertHidden(): Promise<void> {
    await expect(this.locator).not.toBeVisible();
  }

  /**
   * 버튼이 활성화 상태인지 확인
   */
  async assertEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  /**
   * 버튼이 비활성화 상태인지 확인
   */
  async assertDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }

  /**
   * 버튼에 특정 텍스트가 포함되어 있는지 확인
   *
   * @param text - 포함해야 할 텍스트
   */
  async assertContainsText(text: string): Promise<void> {
    await expect(this.locator).toContainText(text);
  }

  /**
   * 버튼이 로딩 상태인지 확인
   */
  async assertLoading(): Promise<void> {
    await expect(this.locator).toHaveClass(/ant-btn-loading/);
  }

  /**
   * 버튼이 로딩 상태가 아닌지 확인
   */
  async assertNotLoading(): Promise<void> {
    await expect(this.locator).not.toHaveClass(/ant-btn-loading/);
  }

  /**
   * 버튼이 포커스 상태인지 확인
   */
  async assertFocused(): Promise<void> {
    await expect(this.locator).toBeFocused();
  }
}
