import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * FormItem Component Object (험블 객체)
 *
 * Ant Design FormItem 컴포넌트 조작을 캡슐화
 * - 라벨, 입력창, 에러 메시지를 포함하는 컨테이너
 * - 에러 메시지 검증
 * - 필드 표시 상태 확인
 *
 * @example
 * const emailField = new FormItemComponent(page, AUTH_SELECTOR.SIGNUP_EMAIL_FIELD);
 * await emailField.assertVisible();
 * await emailField.assertErrorMessage("이메일을 입력해 주세요.");
 */
export class FormItemComponent {
  constructor(
    private page: Page,
    private formItemTestId: string,
  ) {}

  /**
   * FormItem 요소 Locator
   */
  private get locator(): Locator {
    return this.page.locator(testId(this.formItemTestId));
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 라벨 텍스트 반환
   */
  async getLabel(): Promise<string | null> {
    const label = this.locator.locator(".ant-form-item-label");
    if (await label.isVisible()) {
      return await label.textContent();
    }
    return null;
  }

  /**
   * 에러 메시지 텍스트 반환
   */
  async getErrorMessage(): Promise<string | null> {
    const errorMessage = this.locator.locator(".ant-form-item-explain-error");
    if (await errorMessage.isVisible()) {
      return await errorMessage.textContent();
    }
    return null;
  }

  /**
   * 도움말 텍스트 반환
   */
  async getHelpText(): Promise<string | null> {
    const help = this.locator.locator(".ant-form-item-explain");
    if (await help.isVisible()) {
      return await help.textContent();
    }
    return null;
  }

  // ============================================
  // State Checks
  // ============================================

  /**
   * 에러 상태인지 확인
   */
  async hasError(): Promise<boolean> {
    const errorMessage = this.locator.locator(".ant-form-item-explain-error");
    return await errorMessage.isVisible();
  }

  /**
   * 필수 필드인지 확인 (별표 표시 여부)
   */
  async isRequired(): Promise<boolean> {
    const requiredMark = this.locator.locator(
      ".ant-form-item-required, .ant-form-item-label .ant-form-item-required-mark-optional",
    );
    return await requiredMark.isVisible();
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * FormItem이 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }

  /**
   * FormItem이 숨겨져 있는지 확인
   */
  async assertHidden(): Promise<void> {
    await expect(this.locator).not.toBeVisible();
  }

  /**
   * 특정 에러 메시지가 표시되는지 확인
   *
   * @param expectedMessage - 기대하는 에러 메시지
   */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    const errorLocator = this.locator.getByText(expectedMessage);
    await expect(errorLocator).toBeVisible();
  }

  /**
   * 에러가 없는지 확인
   */
  async assertNoError(): Promise<void> {
    const errorMessage = this.locator.locator(".ant-form-item-explain-error");
    await expect(errorMessage).not.toBeVisible();
  }

  /**
   * 특정 라벨이 표시되는지 확인
   *
   * @param expectedLabel - 기대하는 라벨 텍스트
   */
  async assertLabel(expectedLabel: string): Promise<void> {
    const label = this.locator.locator(".ant-form-item-label");
    await expect(label).toContainText(expectedLabel);
  }
}
