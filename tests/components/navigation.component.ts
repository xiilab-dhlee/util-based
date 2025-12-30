import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Navigation Component Object (험블 객체)
 *
 * Ant Design 사이드바 네비게이션 메뉴 조작을 캡슐화
 * - 선택된 메뉴 확인
 * - 메뉴 클릭
 *
 * @example
 * const navigation = new NavigationComponent(page);
 * await navigation.assertSelectedMenu("워크로드");
 * await navigation.clickMenu("대시보드");
 */
export class NavigationComponent {
  constructor(private page: Page) {}

  /**
   * 선택된 메뉴 아이템 Locator
   */
  private get selectedMenuItem(): Locator {
    return this.page.locator(".ant-menu-item-selected .ant-menu-title-content");
  }

  /**
   * 현재 선택된 메뉴 이름 반환
   *
   * @returns 선택된 메뉴 이름
   */
  async getSelectedMenuName(): Promise<string> {
    const text = await this.selectedMenuItem.textContent();
    return text?.trim() ?? "";
  }

  /**
   * 특정 메뉴 클릭
   *
   * @param menuName - 클릭할 메뉴 이름
   */
  async clickMenu(menuName: string): Promise<void> {
    const menu = this.page.locator(
      `.ant-menu-item .ant-menu-title-content:text-is("${menuName}")`,
    );
    await expect(menu).toBeVisible({ timeout: 10000 });
    await menu.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 선택된 메뉴 검증
   *
   * @param menuName - 기대하는 메뉴 이름
   */
  async assertSelectedMenu(menuName: string): Promise<void> {
    await expect(this.selectedMenuItem).toBeVisible({ timeout: 10000 });
    await expect(this.selectedMenuItem).toHaveText(menuName);
  }
}
