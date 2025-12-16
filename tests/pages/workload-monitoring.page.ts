import { expect, type Locator } from "@playwright/test";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { BasePage } from "./base.page";

/**
 * 워크로드 모니터링 페이지 Page Object
 *
 * BasePage를 상속하여 워크로드 모니터링 페이지 전용 기능 제공:
 * - 모니터링 차트
 *
 * @example
 * const monitoringPage = new WorkloadMonitoringPage(page);
 * await monitoringPage.gotoMonitoring("workload-123", "workspace-456");
 * await monitoringPage.assertMonitoringChartVisible();
 */
export class WorkloadMonitoringPage extends BasePage {
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
   * 워크로드 모니터링 페이지로 이동
   * @param workloadId - 워크로드 ID
   * @param workspaceId - 워크스페이스 ID (optional)
   */
  async gotoMonitoring(
    workloadId: string,
    workspaceId?: string,
  ): Promise<void> {
    const path = workspaceId
      ? `/${workloadId}/monitoring?workspaceId=${workspaceId}`
      : `/${workloadId}/monitoring`;
    await this.goto(path);
  }

  // ============================================
  // Locators - 모니터링 영역
  // ============================================

  /** 모니터링 차트 */
  get monitoringChart(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.MONITORING_CHART));
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 모니터링 차트가 표시되는지 확인
   */
  async assertMonitoringChartVisible(): Promise<void> {
    await expect(this.monitoringChart.first()).toBeVisible({ timeout: 10000 });
  }
}
