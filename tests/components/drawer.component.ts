import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR } from "@/shared/constants/selector.constant";

/** Ant Design Drawer 컴포넌트 */
export class DrawerComponent {
  constructor(private page: Page) {}

  private get drawer(): Locator {
    return this.page.locator(ANT_SELECTOR.DRAWER);
  }

  private get title(): Locator {
    return this.drawer.locator(ANT_SELECTOR.DRAWER_TITLE);
  }

  /** 드로어 표시 여부 확인 */
  async isVisible(): Promise<boolean> {
    return await this.drawer.isVisible();
  }

  /** 드로어가 표시될 때까지 대기 */
  async waitForVisible(timeout = 10000): Promise<void> {
    await expect(this.drawer).toBeVisible({ timeout });
  }

  /** 드로어가 닫힐 때까지 대기 */
  async waitForHidden(timeout = 10000): Promise<void> {
    await expect(this.drawer).toBeHidden({ timeout });
  }

  /** 드로어 제목 검증 */
  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.title).toContainText(expectedTitle);
  }
}
