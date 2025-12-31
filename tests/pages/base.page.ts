import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * 모든 페이지의 기본 클래스
 *
 * 공통 기능:
 * - pageHeader: 페이지 헤더 Locator (하위 클래스에서 구현)
 * - goto(): 페이지 이동 (하위 클래스에서 구현)
 * - assertPageVisible(): 페이지 표시 확인
 *
 * SOLID - Single Responsibility: 페이지 공통 동작만 담당
 * SOLID - Open/Closed: 확장에 열림, 수정에 닫힘
 *
 * @example
 * class MyPage extends BasePage {
 *   protected get pageHeaderTestId() { return "my-page-header"; }
 *   protected get basePath() { return "/my-page"; }
 * }
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ============================================
  // Abstract - 하위 클래스에서 구현 필수
  // ============================================

  /** 페이지 헤더 testId (하위 클래스에서 정의) */
  protected abstract get pageHeaderTestId(): string;

  /** 기본 페이지 경로 (하위 클래스에서 정의) */
  protected abstract get basePath(): string;

  // ============================================
  // Locators
  // ============================================

  /** 페이지 헤더 */
  get pageHeader(): Locator {
    return this.page.locator(testId(this.pageHeaderTestId));
  }

  // ============================================
  // Navigation
  // ============================================

  /**
   * 페이지로 이동
   * @param path - 추가 경로 (optional)
   */
  async goto(path = ""): Promise<void> {
    await this.page.goto(`${this.basePath}${path}`);
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 페이지가 표시되었는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertPageVisible(timeout = 10000): Promise<void> {
    await expect(this.pageHeader).toBeVisible({ timeout });
  }

  // ============================================
  // Utilities
  // ============================================

  /**
   * 지정된 길이의 랜덤 테스트용 문자열 생성
   * maxLength 검증 등에 활용
   *
   * @param length - 생성할 문자열 길이
   * @returns 지정된 길이의 랜덤 문자열
   *
   * @example
   * this.generateRandomText(10) // "aB3xKp9mZq"
   */
  protected generateRandomText(length: number): string {
    if (length <= 0) return "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아자차카타파하";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
