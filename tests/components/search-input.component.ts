import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Search Input Component Object (험블 객체)
 *
 * 검색 입력창 조작을 캡슐화
 * - 검색어 입력 및 검색 실행
 * - 검색어 조회
 * - 검색창 상태 검증
 *
 * @example
 * const searchInput = new SearchInputComponent(page, "list-search-input");
 * await searchInput.search("test");
 * await searchInput.assertEmpty();
 */
export class SearchInputComponent {
  constructor(
    private page: Page,
    private inputTestId: string,
  ) {}

  /**
   * 검색 입력창 Locator
   */
  private get input(): Locator {
    return this.page.locator(testId(this.inputTestId));
  }

  /**
   * 검색어 입력 후 Enter 키로 검색 실행
   *
   * @param searchText - 검색할 텍스트
   */
  async search(searchText: string): Promise<void> {
    await this.input.fill(searchText);
    await this.input.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 검색어만 입력 (Enter 없이)
   *
   * @param searchText - 입력할 텍스트
   */
  async fill(searchText: string): Promise<void> {
    await this.input.fill(searchText);
  }

  /**
   * 검색창 초기화 (빈 값으로 설정)
   */
  async clear(): Promise<void> {
    await this.input.clear();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 현재 검색어 반환
   *
   * @returns 현재 입력된 검색어
   */
  async getValue(): Promise<string> {
    return (await this.input.inputValue()) ?? "";
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 검색창이 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.input).toBeVisible({ timeout });
  }

  /**
   * 검색창이 빈 값인지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertEmpty(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toHaveValue("");
  }

  /**
   * 검색창에 특정 값이 입력되어 있는지 확인
   *
   * @param expectedValue - 기대하는 검색어
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertValue(expectedValue: string, timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toHaveValue(expectedValue);
  }

  /**
   * 검색창이 활성화 상태인지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertEnabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toBeEnabled({ timeout });
  }

  /**
   * 검색창이 비활성화 상태인지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertDisabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toBeDisabled({ timeout });
  }
}
