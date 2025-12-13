import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * ApexCharts Chart Component Object (험블 객체)
 *
 * ApexCharts 차트 컴포넌트 검증을 캡슐화
 * - 차트 컨테이너 표시 확인
 * - canvas 렌더링 확인
 *
 * @example
 * const chart = new ChartComponent(page, USER_MONITORING_SELECTOR.RESOURCE_GRAPH);
 * await chart.assertVisible();
 */
export class ChartComponent {
  constructor(
    private page: Page,
    private chartTestId: string,
  ) {}

  /**
   * 차트 컨테이너 Locator
   */
  private get container(): Locator {
    return this.page.locator(testId(this.chartTestId));
  }

  /**
   * ApexCharts canvas Locator
   */
  private get canvas(): Locator {
    return this.container.locator(".apexcharts-canvas");
  }

  /**
   * 차트 컨테이너 표시 여부 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   * @returns 컨테이너가 표시되어 있으면 true
   */
  async isVisible(timeout = 10000): Promise<boolean> {
    try {
      await expect(this.container).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ApexCharts canvas 렌더링 여부 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   * @returns canvas가 렌더링되어 있으면 true
   */
  async isChartRendered(timeout = 10000): Promise<boolean> {
    try {
      await expect(this.canvas).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 차트 표시 검증 (컨테이너 + canvas)
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
    await expect(this.canvas).toBeVisible({ timeout });
  }

  /**
   * 차트 컨테이너만 표시 검증
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertContainerVisible(timeout = 10000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
  }

  /**
   * 테이블 바디 표시 검증 (차트 내 테이블이 있는 경우)
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertTableVisible(timeout = 10000): Promise<void> {
    await expect(this.container).toBeVisible({ timeout });
    const tableBody = this.container.locator(".ant-table-tbody");
    await expect(tableBody).toBeVisible({ timeout });
  }
}
