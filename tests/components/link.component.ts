import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Link Component Object (험블 객체)
 *
 * 앵커 링크 및 Next.js Link 컴포넌트 조작을 캡슐화
 * - 클릭 및 네비게이션
 * - href 확인
 * - 텍스트 확인
 *
 * @example
 * const loginLink = new LinkComponent(page, AUTH_SELECTOR.SIGNUP_LOGIN_LINK);
 * await loginLink.click();
 * await loginLink.assertHref("/login");
 */
export class LinkComponent {
  constructor(
    private page: Page,
    private linkTestId: string,
  ) {}

  /**
   * 링크 요소 Locator
   */
  private get locator(): Locator {
    return this.page.locator(testId(this.linkTestId));
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 링크 클릭
   */
  async click(): Promise<void> {
    await this.locator.click();
  }

  /**
   * 링크 호버
   */
  async hover(): Promise<void> {
    await this.locator.hover();
  }

  /**
   * 링크 포커스
   */
  async focus(): Promise<void> {
    await this.locator.focus();
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 링크 텍스트 반환
   */
  async getText(): Promise<string | null> {
    return await this.locator.textContent();
  }

  /**
   * href 속성 반환
   */
  async getHref(): Promise<string | null> {
    return await this.locator.getAttribute("href");
  }

  /**
   * target 속성 반환
   */
  async getTarget(): Promise<string | null> {
    return await this.locator.getAttribute("target");
  }

  /**
   * 외부 링크인지 확인 (target="_blank")
   */
  async isExternalLink(): Promise<boolean> {
    const target = await this.getTarget();
    return target === "_blank";
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 링크가 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }

  /**
   * 링크가 숨겨져 있는지 확인
   */
  async assertHidden(): Promise<void> {
    await expect(this.locator).not.toBeVisible();
  }

  /**
   * 특정 href를 가지고 있는지 확인
   *
   * @param expectedHref - 기대하는 href 값
   */
  async assertHref(expectedHref: string): Promise<void> {
    await expect(this.locator).toHaveAttribute("href", expectedHref);
  }

  /**
   * href가 특정 패턴을 포함하는지 확인
   *
   * @param pattern - href에 포함되어야 할 패턴 (문자열 또는 정규식)
   */
  async assertHrefContains(pattern: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveAttribute("href", pattern);
  }

  /**
   * 링크에 특정 텍스트가 포함되어 있는지 확인
   *
   * @param text - 포함해야 할 텍스트
   */
  async assertContainsText(text: string): Promise<void> {
    await expect(this.locator).toContainText(text);
  }

  /**
   * 링크가 활성화 상태인지 확인 (disabled 아님)
   */
  async assertEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  /**
   * 링크가 포커스 상태인지 확인
   */
  async assertFocused(): Promise<void> {
    await expect(this.locator).toBeFocused();
  }

  /**
   * 외부 링크인지 확인 (target="_blank")
   */
  async assertExternalLink(): Promise<void> {
    await expect(this.locator).toHaveAttribute("target", "_blank");
  }

  /**
   * 내부 링크인지 확인 (target="_blank" 없음)
   */
  async assertInternalLink(): Promise<void> {
    const target = await this.getTarget();
    expect(target).not.toBe("_blank");
  }
}
