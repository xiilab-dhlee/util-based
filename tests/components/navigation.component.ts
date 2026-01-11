import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR } from "@/shared/constants/selector.constant";

/** Ant Design 사이드바 네비게이션 컴포넌트 */
export class NavigationComponent {
  constructor(private page: Page) {}

  private get selectedMenuItem(): Locator {
    return this.page.locator(ANT_SELECTOR.MENU_ITEM_SELECTED);
  }

  /** 현재 선택된 메뉴 이름 반환 */
  async getSelectedMenuName(): Promise<string> {
    const text = await this.selectedMenuItem.textContent();
    return text?.trim() ?? "";
  }

  /** 특정 메뉴 클릭 */
  async clickMenu(menuName: string): Promise<void> {
    const menu = this.page.locator(
      `.ant-menu-item ${ANT_SELECTOR.MENU_TITLE_CONTENT}:text-is("${menuName}")`,
    );
    await expect(menu).toBeVisible({ timeout: 10000 });
    await menu.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 선택된 메뉴 검증 */
  async assertSelectedMenu(menuName: string): Promise<void> {
    await expect(this.selectedMenuItem).toBeVisible({ timeout: 10000 });
    await expect(this.selectedMenuItem).toHaveText(menuName);
  }
}
