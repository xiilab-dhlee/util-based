import { expect, type Locator, type Page } from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";

/**
 * Toast 메시지 Component Object (험블 객체)
 *
 * react-toastify 토스트 메시지 조작을 캡슐화
 * - 토스트 표시 확인
 * - 메시지 내용 검증
 *
 * @example
 * const toast = new ToastComponent(page);
 * await toast.assertMessage("테마가 적용되었습니다.");
 */
export class ToastComponent {
  constructor(private page: Page) {}

  // ============================================
  // Locators
  // ============================================

  /** 토스트 메시지 */
  get message(): Locator {
    return this.page.locator(SELECTOR.TOAST_MESSAGE);
  }

  /** 토스트 컨테이너 */
  get container(): Locator {
    return this.page.locator(testId(SELECTOR.TOAST_CONTAINER));
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 특정 메시지를 포함한 토스트가 표시되는지 확인
   * @param expectedMessage - 예상 메시지 (부분 일치)
   * @param timeout - 대기 시간 (기본 5초)
   */
  async assertMessage(expectedMessage: string, timeout = 5000): Promise<void> {
    await expect(this.message).toBeVisible({ timeout });
    await expect(this.message).toContainText(expectedMessage);
  }

  /**
   * 토스트가 표시될 때까지 대기
   * @param timeout - 대기 시간 (기본 5초)
   */
  async waitForVisible(timeout = 5000): Promise<void> {
    await expect(this.message).toBeVisible({ timeout });
  }

  /**
   * 토스트가 사라질 때까지 대기
   * @param timeout - 대기 시간 (기본 10초, 토스트 자동 닫힘 고려)
   */
  async waitForHidden(timeout = 10000): Promise<void> {
    await expect(this.message).not.toBeVisible({ timeout });
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 현재 토스트 메시지 텍스트 반환
   */
  async getText(): Promise<string> {
    return (await this.message.textContent()) ?? "";
  }
}
