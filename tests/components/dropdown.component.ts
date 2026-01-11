import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR, testId } from "@/shared/constants/selector.constant";

/** 정규식 메타 문자 이스케이프 */
const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Ant Design Select 드롭다운 컴포넌트 */
export class DropdownComponent {
  constructor(
    private page: Page,
    private wrapId: string,
  ) {}

  private get wrapper(): Locator {
    return this.page.locator(testId(this.wrapId));
  }

  /** 현재 선택된 값 반환, 없으면 null */
  async getSelectedValue(): Promise<string | null> {
    const selectedItem = this.wrapper.locator(
      ANT_SELECTOR.SELECT_SELECTED_ITEM,
    );
    return (await selectedItem.isVisible())
      ? await selectedItem.textContent()
      : null;
  }

  /** 빈 상태인지 확인 (placeholder 표시 여부) */
  async isEmpty(): Promise<boolean> {
    const placeholder = this.wrapper.locator(ANT_SELECTOR.SELECT_PLACEHOLDER);
    return await placeholder.isVisible();
  }

  /** 특정 텍스트 포함 여부 확인 */
  async containsText(text: string): Promise<boolean> {
    const wrapperText = await this.wrapper.textContent();
    return wrapperText?.includes(text) ?? false;
  }

  /** 드롭다운에서 옵션 선택 */
  async select(option: string): Promise<void> {
    await this.wrapper.click();
    const escapedOption = escapeRegExp(option);
    await this.page
      .locator(ANT_SELECTOR.SELECT_VISIBLE_OPTION, {
        hasText: new RegExp(`^${escapedOption}$`),
      })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 드롭다운이 표시되는지 검증 */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.wrapper).toBeVisible({ timeout });
  }

  /** 빈 상태인지 검증 (placeholder 표시) */
  async assertEmpty(): Promise<void> {
    await this.assertVisible();
    const placeholder = this.wrapper.locator(ANT_SELECTOR.SELECT_PLACEHOLDER);
    await expect(placeholder).toBeVisible();
  }

  /** 특정 텍스트 포함 여부 검증 */
  async assertContainsText(text: string): Promise<void> {
    await expect(this.wrapper).toContainText(text);
  }

  /** 선택된 값이 유효한 옵션 목록에 포함되는지 검증 */
  async assertSelectedValueIsOneOf(validOptions: string[]): Promise<void> {
    await this.assertVisible();

    const selectedValue = await this.getSelectedValue();
    if (selectedValue === null) {
      throw new Error("드롭다운 값이 선택되지 않았습니다");
    }

    expect(validOptions).toContain(selectedValue.trim());
  }
}
