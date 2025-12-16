import { expect, type Locator, type Page } from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";

/**
 * 테마 선택 팝오버 Component Object (험블 객체)
 *
 * 로그/웹터미널 페이지의 테마 선택 팝오버 조작을 캡슐화
 * - 팝오버 표시 확인
 * - 테마 옵션 선택
 * - 현재 테마와 다른 테마 선택
 *
 * @example
 * const themePopover = new ThemePopoverComponent(page);
 * await themePopover.waitForVisible();
 * await themePopover.selectDifferentTheme();
 */
export class ThemePopoverComponent {
  /** 사용 가능한 테마 목록 */
  static readonly THEME_NAMES = Object.keys(TERMINAL_THEME_LIST);

  constructor(private page: Page) {}

  // ============================================
  // Locators
  // ============================================

  /** 팝오버 컨테이너 */
  get container(): Locator {
    return this.page.locator(testId(SELECTOR.THEME_POPOVER));
  }

  /**
   * 특정 테마 옵션 Locator
   * @param themeName - 테마 이름 (예: "MaterialDark", "Github")
   */
  getThemeOption(themeName: string): Locator {
    return this.page.locator(testId(SELECTOR.themeOption(themeName)));
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 팝오버가 표시될 때까지 대기
   * @param timeout - 대기 시간 (기본 5초)
   */
  async waitForVisible(timeout = 5000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
  }

  /**
   * 팝오버가 닫힐 때까지 대기
   * @param timeout - 대기 시간 (기본 5초)
   */
  async waitForHidden(timeout = 5000): Promise<void> {
    await expect(this.container).not.toBeVisible({ timeout });
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 특정 테마 선택
   * @param themeName - 선택할 테마 이름
   */
  async selectTheme(themeName: string): Promise<void> {
    const option = this.getThemeOption(themeName);
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();
  }

  /**
   * 현재 선택된 테마 옵션 Locator (selected 클래스를 가진 옵션)
   */
  get selectedOption(): Locator {
    return this.container.locator(".selected");
  }

  /**
   * 현재 선택된 테마와 다른 테마 선택
   * 팝오버 내에서 selected 클래스로 현재 테마를 확인하고 다른 테마 선택
   * @returns 새로 선택된 테마 이름
   */
  async selectDifferentTheme(): Promise<string> {
    // 현재 선택된 테마 확인 (팝오버 내 selected 클래스)
    const selectedOption = this.selectedOption;
    let currentTheme: string | undefined;

    if (await selectedOption.isVisible()) {
      const testIdAttr = await selectedOption.getAttribute("data-testid");
      // data-testid="theme-option-{themeName}" 형식에서 테마 이름 추출
      currentTheme = testIdAttr?.replace("theme-option-", "");
    }

    // 현재 테마와 다른 테마 선택
    const newTheme = ThemePopoverComponent.THEME_NAMES.find(
      (theme) => theme !== currentTheme,
    );

    if (!newTheme) {
      throw new Error("선택 가능한 다른 테마가 없습니다");
    }

    await this.selectTheme(newTheme);
    return newTheme;
  }
}
