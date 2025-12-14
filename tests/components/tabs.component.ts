import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Custom Tabs Component Object (험블 객체)
 *
 * 커스텀 탭 컴포넌트 조작을 캡슐화
 * - 탭 선택/클릭
 * - 활성 탭 확인
 * - 비활성화 탭 확인
 *
 * @example
 * const tabs = new TabsComponent(page, ".tabs-nav");
 * await tabs.assertActiveTab("상세정보");
 * await tabs.clickTab("로그");
 */
export class TabsComponent {
  constructor(
    private page: Page,
    private tabsSelector: string,
  ) {}

  /**
   * 탭 네비게이션 요소 Locator
   */
  private get tabsNav(): Locator {
    return this.page.locator(this.tabsSelector);
  }

  /**
   * 현재 선택된 탭 라벨 Locator
   */
  private get activeTabLabel(): Locator {
    return this.tabsNav.locator(".tab-item.active .tab-label");
  }

  /**
   * 현재 선택된 탭 이름 반환
   *
   * @returns 활성 탭 이름
   */
  async getActiveTabName(): Promise<string> {
    const text = await this.activeTabLabel.textContent();
    return text?.trim() ?? "";
  }

  /**
   * 특정 탭 클릭
   *
   * @param tabName - 클릭할 탭 이름
   */
  async clickTab(tabName: string): Promise<void> {
    // :text-is()는 정확히 일치 (공백 정규화 포함)
    // "활성화"와 "비활성화" 구분을 위해 사용
    const tab = this.tabsNav.locator(
      `.tab-item .tab-label:text-is("${tabName}")`,
    );
    await expect(tab).toBeVisible({ timeout: 10000 });
    await tab.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 탭이 비활성화되어 있는지 확인
   *
   * @param tabName - 확인할 탭 이름
   * @returns 비활성화되어 있으면 true
   */
  async isTabDisabled(tabName: string): Promise<boolean> {
    const disabledTab = this.tabsNav.locator(
      `.tab-item.disabled .tab-label:text("${tabName}")`,
    );
    return await disabledTab.isVisible();
  }

  /**
   * 선택된 탭 검증
   *
   * @param tabName - 기대하는 탭 이름
   */
  async assertActiveTab(tabName: string): Promise<void> {
    await expect(this.activeTabLabel).toBeVisible();
    await expect(this.activeTabLabel).toHaveText(tabName);
  }

  /**
   * 탭이 비활성화되어 있는지 검증
   *
   * @param tabName - 확인할 탭 이름
   */
  async assertTabDisabled(tabName: string): Promise<void> {
    // :text()는 정확히 일치, :has-text()는 부분 일치
    const disabledTab = this.tabsNav.locator(
      `.tab-item.disabled .tab-label:text("${tabName}")`,
    );
    await expect(disabledTab).toBeVisible({ timeout: 10000 });
  }

  /**
   * 탭이 활성화(클릭 가능)되어 있는지 검증
   *
   * @param tabName - 확인할 탭 이름
   */
  async assertTabEnabled(tabName: string): Promise<void> {
    // disabled 클래스가 없는 탭 확인
    const enabledTab = this.tabsNav.locator(
      `.tab-item:not(.disabled) .tab-label:text("${tabName}")`,
    );
    await expect(enabledTab).toBeVisible({ timeout: 10000 });
  }
}
