import type { Locator, Page } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { ChartComponent } from "../components/chart.component";
import type { AssertLogger } from "../fixtures";
import { BasePage } from "./base.page";

/**
 * 워크로드 모니터링 페이지 Page Object
 *
 * BasePage를 상속하여 워크로드 모니터링 페이지 전용 기능 제공:
 * - CPU 사용량, 메모리 사용량, GPU 활용률, GPU 메모리 차트
 *
 * @example
 * const monitoringPage = new WorkloadMonitoringPage(page);
 * await monitoringPage.gotoMonitoring("workload-123", "workspace-456");
 * await monitoringPage.assertMonitoringChartsVisible();
 */
export class WorkloadMonitoringPage extends BasePage {
  /** CPU 사용량 차트 */
  readonly cpuUsageChart: ChartComponent;
  /** 메모리 사용량 차트 */
  readonly memoryUsageChart: ChartComponent;
  /** GPU 활용률 차트 */
  readonly gpuUtilizationChart: ChartComponent;
  /** GPU 메모리 차트 */
  readonly gpuMemoryChart: ChartComponent;

  constructor(page: Page) {
    super(page);
    this.cpuUsageChart = new ChartComponent(
      page,
      WORKLOAD_SELECTOR.monitoringChart("cpu-usage"),
    );
    this.memoryUsageChart = new ChartComponent(
      page,
      WORKLOAD_SELECTOR.monitoringChart("memory-usage"),
    );
    this.gpuUtilizationChart = new ChartComponent(
      page,
      WORKLOAD_SELECTOR.monitoringChart("gpu-utilization"),
    );
    this.gpuMemoryChart = new ChartComponent(
      page,
      WORKLOAD_SELECTOR.monitoringChart("gpu-memory"),
    );
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL;
  }

  protected get basePath(): string {
    return ROUTES.USER_WORKLOAD;
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
    const fullPath = workspaceId
      ? `${ROUTES.USER_WORKLOAD_MONITORING(workloadId)}?workspaceId=${workspaceId}`
      : ROUTES.USER_WORKLOAD_MONITORING(workloadId);
    await this.page.goto(fullPath);
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // Locators - 모니터링 영역
  // ============================================

  /** 모니터링 차트 카드 (전체) */
  get monitoringCharts(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.MONITORING_CHART));
  }

  /** 모니터링 차트 타이틀 (전체) */
  get monitoringChartTitles(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.MONITORING_CHART_TITLE));
  }

  // ============================================
  // Assertions - 개별 차트 검증
  // ============================================

  /**
   * CPU 사용량 차트가 표시되는지 확인
   * @param logger - AssertLogger (fixture에서 제공)
   */
  async assertCpuUsageChartVisible(logger: AssertLogger): Promise<void> {
    const isRendered = await this.cpuUsageChart.isChartRendered();
    logger.assertEqual("CPU 사용량 차트 렌더링", isRendered, true);
  }

  /**
   * 메모리 사용량 차트가 표시되는지 확인
   * @param logger - AssertLogger (fixture에서 제공)
   */
  async assertMemoryUsageChartVisible(logger: AssertLogger): Promise<void> {
    const isRendered = await this.memoryUsageChart.isChartRendered();
    logger.assertEqual("메모리 사용량 차트 렌더링", isRendered, true);
  }

  /**
   * GPU 활용률 차트가 표시되는지 확인
   * @param logger - AssertLogger (fixture에서 제공)
   */
  async assertGpuUtilizationChartVisible(logger: AssertLogger): Promise<void> {
    const isRendered = await this.gpuUtilizationChart.isChartRendered();
    logger.assertEqual("GPU 활용률 차트 렌더링", isRendered, true);
  }

  /**
   * GPU 메모리 차트가 표시되는지 확인
   * @param logger - AssertLogger (fixture에서 제공)
   */
  async assertGpuMemoryChartVisible(logger: AssertLogger): Promise<void> {
    const isRendered = await this.gpuMemoryChart.isChartRendered();
    logger.assertEqual("GPU 메모리 차트 렌더링", isRendered, true);
  }

  /**
   * 모니터링 차트 개수 반환
   */
  async getMonitoringChartCount(): Promise<number> {
    return this.monitoringCharts.count();
  }

  /**
   * 모니터링 차트 타이틀 목록 반환
   */
  async getMonitoringChartTitles(): Promise<string[]> {
    const titles = await this.monitoringChartTitles.allTextContents();
    return titles.map((text) => text.trim());
  }
}
