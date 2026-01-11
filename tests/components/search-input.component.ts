import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/** 검색 입력창 컴포넌트 */
export class SearchInputComponent {
  constructor(
    private page: Page,
    private inputTestId: string,
  ) {}

  private get input(): Locator {
    return this.page.locator(testId(this.inputTestId));
  }

  /** 검색어 입력 후 Enter 키로 검색 실행 */
  async search(searchText: string): Promise<void> {
    await this.input.fill(searchText);
    await this.input.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /** 검색어만 입력 (Enter 없이) */
  async fill(searchText: string): Promise<void> {
    await this.input.fill(searchText);
  }

  /** 검색창 초기화 */
  async clear(): Promise<void> {
    await this.input.clear();
    await this.page.waitForLoadState("networkidle");
  }

  /** 현재 검색어 반환 */
  async getValue(): Promise<string> {
    return (await this.input.inputValue()) ?? "";
  }

  /** 검색창이 표시되는지 검증 */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.input).toBeVisible({ timeout });
  }

  /** 검색창이 빈 값인지 검증 */
  async assertEmpty(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toHaveValue("");
  }

  /** 검색창에 특정 값이 입력되어 있는지 검증 */
  async assertValue(expectedValue: string, timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toHaveValue(expectedValue);
  }

  /** 검색창이 활성화 상태인지 검증 */
  async assertEnabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toBeEnabled({ timeout });
  }

  /** 검색창이 비활성화 상태인지 검증 */
  async assertDisabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.input).toBeDisabled({ timeout });
  }
}
