import { expect, type Locator } from "@playwright/test";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { BasePage } from "./base.page";

/**
 * 워크로드 웹터미널 페이지 Page Object
 *
 * BasePage를 상속하여 워크로드 웹터미널 페이지 전용 기능 제공:
 * - xterm 터미널 컨테이너
 * - 모니터링 버튼, 테마 변경 버튼
 *
 * @example
 * const terminalPage = new WorkloadTerminalPage(page);
 * await terminalPage.gotoTerminal("workload-123", "workspace-456");
 * await terminalPage.assertTerminalVisible();
 */
export class WorkloadTerminalPage extends BasePage {
  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL;
  }

  protected get basePath(): string {
    return "/user/workload";
  }

  // ============================================
  // Navigation
  // ============================================

  /**
   * 워크로드 웹터미널 페이지로 이동
   * @param workloadId - 워크로드 ID
   * @param workspaceId - 워크스페이스 ID (optional)
   */
  async gotoTerminal(workloadId: string, workspaceId?: string): Promise<void> {
    const path = workspaceId
      ? `/${workloadId}/terminal?workspaceId=${workspaceId}`
      : `/${workloadId}/terminal`;
    await this.goto(path);
  }

  // ============================================
  // Locators - 터미널 영역
  // ============================================

  /** xterm 터미널 컨테이너 */
  get terminalContainer(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER));
  }

  /** 터미널 패널 (분할된 각 터미널) */
  get terminalPanels(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.TERMINAL_NODE));
  }

  // ============================================
  // Locators - 버튼
  // ============================================

  /** 모니터링 버튼 */
  get monitoringButton(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_MONITORING_BUTTON),
    );
  }

  /** 수직 분할 버튼 */
  get splitVerticalButton(): Locator {
    return this.page
      .locator(testId(WORKLOAD_SELECTOR.TERMINAL_SPLIT_VERTICAL_BUTTON))
      .first();
  }

  /** 수평 분할 버튼 */
  get splitHorizontalButton(): Locator {
    return this.page
      .locator(testId(WORKLOAD_SELECTOR.TERMINAL_SPLIT_HORIZONTAL_BUTTON))
      .first();
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * xterm 터미널이 표시되는지 확인
   */
  async assertTerminalVisible(): Promise<void> {
    await expect(this.terminalContainer).toBeVisible({ timeout: 10000 });
  }

  /**
   * 모니터링 버튼이 표시되는지 확인
   */
  async assertMonitoringButtonVisible(): Promise<void> {
    await expect(this.monitoringButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * 터미널 패널 개수 확인
   * @param expectedCount - 예상되는 패널 개수
   */
  async assertTerminalPanelCount(expectedCount: number): Promise<void> {
    await expect(this.terminalPanels.first()).toBeVisible({ timeout: 10000 });
    await expect(this.terminalPanels).toHaveCount(expectedCount);
  }

  /**
   * 테마가 적용되었는지 확인
   * 터미널 컨테이너에 테마 관련 클래스가 있는지 검증
   * @param themeNames - 유효한 테마 이름 배열
   */
  async assertThemeApplied(themeNames: string[]): Promise<void> {
    await expect(this.terminalContainer).toBeVisible({ timeout: 5000 });
    const className =
      (await this.terminalContainer.getAttribute("class")) ?? "";
    const hasTheme = themeNames.some((theme) => className.includes(theme));
    expect(
      hasTheme,
      `테마가 적용되지 않음. 현재 클래스: "${className}", 기대 테마: [${themeNames.join(", ")}]`,
    ).toBe(true);
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 모니터링 버튼 클릭
   */
  async clickMonitoringButton(): Promise<void> {
    await expect(this.monitoringButton).toBeVisible({ timeout: 10000 });
    await this.monitoringButton.click();
  }

  /**
   * 수직 분할 버튼 클릭
   */
  async clickSplitVertical(): Promise<void> {
    await expect(this.splitVerticalButton).toBeVisible({ timeout: 5000 });
    await this.splitVerticalButton.click();
  }

  /**
   * 수평 분할 버튼 클릭
   */
  async clickSplitHorizontal(): Promise<void> {
    await expect(this.splitHorizontalButton).toBeVisible({ timeout: 5000 });
    await this.splitHorizontalButton.click();
  }
}
