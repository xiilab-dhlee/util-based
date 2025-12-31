import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Input Component Object (험블 객체)
 *
 * 입력 필드 조작을 캡슐화
 * - 값 입력 및 조회
 * - 입력 상태 검증
 * - maxLength 등 제약사항 검증
 *
 * @example
 * const emailInput = new InputComponent(page, AUTH_SELECTOR.SIGNUP_EMAIL_INPUT);
 * await emailInput.fill("user@example.com");
 * await emailInput.assertValue("user@example.com");
 */
export class InputComponent {
  constructor(
    private page: Page,
    private inputTestId: string,
  ) {}

  /**
   * Input 요소 Locator
   */
  private get locator(): Locator {
    return this.page.locator(testId(this.inputTestId));
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 값 입력
   *
   * @param value - 입력할 값
   */
  async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  /**
   * 값 입력 후 Enter 키 입력
   *
   * @param value - 입력할 값
   */
  async fillAndSubmit(value: string): Promise<void> {
    await this.locator.fill(value);
    await this.locator.press("Enter");
  }

  /**
   * 입력창 초기화
   */
  async clear(): Promise<void> {
    await this.locator.clear();
  }

  /**
   * 포커스 설정
   */
  async focus(): Promise<void> {
    await this.locator.focus();
  }

  /**
   * 클릭
   */
  async click(): Promise<void> {
    await this.locator.click();
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 현재 입력된 값 반환
   */
  async getValue(): Promise<string> {
    return await this.locator.inputValue();
  }

  /**
   * 입력된 값의 길이 반환
   */
  async getValueLength(): Promise<number> {
    const value = await this.getValue();
    return value.length;
  }

  /**
   * maxLength 속성값 반환
   */
  async getMaxLength(): Promise<number | null> {
    const maxLength = await this.locator.getAttribute("maxlength");
    return maxLength ? parseInt(maxLength, 10) : null;
  }

  /**
   * placeholder 속성값 반환
   */
  async getPlaceholder(): Promise<string | null> {
    return await this.locator.getAttribute("placeholder");
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 입력창이 표시되는지 확인
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }

  /**
   * 입력창이 빈 값인지 확인
   */
  async assertEmpty(): Promise<void> {
    await expect(this.locator).toHaveValue("");
  }

  /**
   * 입력창에 특정 값이 있는지 확인
   */
  async assertValue(expectedValue: string): Promise<void> {
    await expect(this.locator).toHaveValue(expectedValue);
  }

  /**
   * 입력된 값의 길이 확인
   */
  async assertValueLength(expectedLength: number): Promise<void> {
    const length = await this.getValueLength();
    expect(length).toBe(expectedLength);
  }

  /**
   * 입력창이 활성화 상태인지 확인
   */
  async assertEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  /**
   * 입력창이 비활성화 상태인지 확인
   */
  async assertDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }

  /**
   * 입력창이 포커스 상태인지 확인
   */
  async assertFocused(): Promise<void> {
    await expect(this.locator).toBeFocused();
  }
}
