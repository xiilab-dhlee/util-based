import { expect, type Locator, type Page } from "@playwright/test";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { ButtonComponent } from "../components/button.component";
import { BasePage } from "./base.page";

/**
 * 워크로드 로그 페이지 Page Object
 *
 * BasePage를 상속하여 워크로드 로그 페이지 전용 기능 제공:
 * - 로그 뷰어, 로그 라인
 * - 모니터링 버튼, 테마 변경 버튼
 *
 * @example
 * const logPage = new WorkloadLogPage(page);
 * await logPage.gotoLog("workload-123", "workspace-456");
 * await logPage.assertLogLinesExist();
 */
export class WorkloadLogPage extends BasePage {
  // ============================================
  // Instance Properties - Button 험블 객체
  // ============================================

  /** 모니터링 버튼 컴포넌트 */
  readonly monitoringButton: ButtonComponent;

  constructor(page: Page) {
    super(page);
    this.monitoringButton = new ButtonComponent(
      page,
      WORKLOAD_SELECTOR.DETAIL_MONITORING_BUTTON,
    );
  }

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
   * 워크로드 로그 페이지로 이동
   * @param workloadId - 워크로드 ID
   * @param workspaceId - 워크스페이스 ID (optional)
   */
  async gotoLog(workloadId: string, workspaceId?: string): Promise<void> {
    const path = workspaceId
      ? `/${workloadId}/log?workspaceId=${workspaceId}`
      : `/${workloadId}/log`;
    await this.goto(path);
  }

  // ============================================
  // Locators - 로그 영역
  // ============================================

  /** 로그 뷰어 */
  get logViewer(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.LOG_VIEWER));
  }

  /** 로그 라인 (모든 라인) */
  get logLines(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.LOG_LINE));
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 로그 라인이 하나 이상 존재하는지 확인
   */
  async assertLogLinesExist(): Promise<void> {
    await expect(this.logLines.first()).toBeVisible({ timeout: 10000 });
    const count = await this.logLines.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * 모니터링 버튼이 표시되는지 확인
   */
  async assertMonitoringButtonVisible(): Promise<void> {
    await this.monitoringButton.assertVisible();
  }

  // ============================================
  // Actions
  // ============================================

  /**
   * 모니터링 버튼 클릭
   */
  async clickMonitoringButton(): Promise<void> {
    await this.monitoringButton.click();
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * 로그 라인 개수 반환
   */
  async getLogLineCount(): Promise<number> {
    return await this.logLines.count();
  }
}
