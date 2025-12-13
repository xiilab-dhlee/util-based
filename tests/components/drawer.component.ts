import { expect, type Locator, type Page } from "@playwright/test";

import { SELECTOR } from "@/shared/constants/selector.constant";

/**
 * Ant Design Drawer Component Object (험블 객체)
 *
 * Ant Design Drawer 컴포넌트 조작을 캡슐화
 * - 드로어 표시/숨김 확인
 * - 제목 검증
 * - 버튼 클릭
 *
 * @example
 * const drawer = new DrawerComponent(page);
 * await drawer.waitForVisible();
 * await drawer.assertTitle("워크로드 생성");
 * await drawer.clickButton("취소");
 */
export class DrawerComponent {
  constructor(private page: Page) {}

  /**
   * 드로어 요소 Locator
   */
  private get drawer(): Locator {
    return this.page.locator(SELECTOR.DRAWER);
  }

  /**
   * 드로어 제목 Locator
   */
  private get title(): Locator {
    return this.drawer.locator(".ant-drawer-title");
  }

  /**
   * 드로어 표시 여부 확인
   *
   * @returns 드로어가 표시되어 있으면 true
   */
  async isVisible(): Promise<boolean> {
    return await this.drawer.isVisible();
  }

  /**
   * 드로어가 표시될 때까지 대기 (애니메이션 완료 포함)
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForVisible(timeout = 10000): Promise<void> {
    await expect(this.drawer).toBeVisible({ timeout });
  }

  /**
   * 드로어가 닫힐 때까지 대기
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForHidden(timeout = 10000): Promise<void> {
    await expect(this.drawer).toBeHidden({ timeout });
  }

  /**
   * 드로어 제목 검증
   *
   * @param expectedTitle - 기대하는 제목 텍스트
   */
  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.title).toContainText(expectedTitle);
  }

  /**
   * 드로어 내 버튼 클릭
   *
   * @param buttonText - 버튼 텍스트 (예: "취소", "이전 단계")
   */
  async clickButton(buttonText: string): Promise<void> {
    const button = this.drawer.getByRole("button", { name: buttonText });
    await button.click();
  }
}
