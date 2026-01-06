import { expect, type Locator, type Page } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import {
  testId,
  USER_MONITORING_SELECTOR,
} from "@/shared/constants/selector.constant";
import { ChartComponent } from "../components/chart.component";
import { BasePage } from "./base.page";

/** 워크로드 상태 목록 */
const WORKLOAD_STATUSES = [
  "all",
  "running",
  "completed",
  "pending",
  "failed",
] as const;
type WorkloadStatus = (typeof WORKLOAD_STATUSES)[number];

/**
 * 사용자 모니터링 페이지 Page Object
 *
 * BasePage를 상속하여 모니터링 페이지 전용 기능 제공:
 * - 리소스 그래프, 리소스 회수, 워크로드 상태 차트
 * - 상태별 건수, 사용 자원 정보
 *
 * 상속 계층: BasePage > MonitoringPage
 *
 * @example
 * const monitoringPage = new MonitoringPage(page);
 * await monitoringPage.goto();
 * const count = await monitoringPage.getStatusCount("running");
 */
export class MonitoringPage extends BasePage {
  /** CPU 리소스 그래프 */
  readonly resourceGraph: ChartComponent;
  /** 리소스 회수 정보 차트 */
  readonly resourceRecovery: ChartComponent;
  /** 워크로드 상태 정보 차트 */
  readonly workloadStatusChart: ChartComponent;
  /** 실행 중 워크로드 목록 */
  readonly runningWorkloadList: ChartComponent;
  /** 리소스 회수 예정 워크로드 목록 */
  readonly recoveryWorkloadList: ChartComponent;

  constructor(page: Page) {
    super(page);
    this.resourceGraph = new ChartComponent(
      page,
      USER_MONITORING_SELECTOR.RESOURCE_GRAPH,
    );
    this.resourceRecovery = new ChartComponent(
      page,
      USER_MONITORING_SELECTOR.RESOURCE_RECOVERY,
    );
    this.workloadStatusChart = new ChartComponent(
      page,
      USER_MONITORING_SELECTOR.WORKLOAD_STATUS,
    );
    this.runningWorkloadList = new ChartComponent(
      page,
      USER_MONITORING_SELECTOR.RUNNING_WORKLOAD_LIST,
    );
    this.recoveryWorkloadList = new ChartComponent(
      page,
      USER_MONITORING_SELECTOR.RECOVERY_WORKLOAD_LIST,
    );
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return USER_MONITORING_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return ROUTES.USER_MONITORING;
  }

  // ============================================
  // Locators
  // ============================================

  /** 사용 자원 정보 영역 */
  get resourceUsage(): Locator {
    return this.page.locator(testId(USER_MONITORING_SELECTOR.RESOURCE_USAGE));
  }

  /**
   * 상태별 건수 Locator 반환
   * @param status - 워크로드 상태
   */
  getStatusCountLocator(status: WorkloadStatus): Locator {
    return this.page.locator(
      testId(USER_MONITORING_SELECTOR.statusCount(status)),
    );
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 사용 자원 정보가 표시되었는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertResourceUsageVisible(timeout = 10000): Promise<void> {
    await expect(this.resourceUsage).toBeVisible({ timeout });
  }

  // ============================================
  // Status Count Methods
  // ============================================

  /**
   * 모든 상태 목록 반환
   */
  static get statuses(): readonly WorkloadStatus[] {
    return WORKLOAD_STATUSES;
  }

  /**
   * 개별 상태 목록 반환 (all 제외)
   */
  static get individualStatuses(): readonly WorkloadStatus[] {
    return ["running", "completed", "pending", "failed"] as const;
  }

  /**
   * 상태별 건수 텍스트 반환
   * @param status - 워크로드 상태
   * @param timeout - 대기 시간
   * @returns 건수 텍스트 (예: "8,888건")
   */
  async getStatusCountText(
    status: WorkloadStatus,
    timeout = 10000,
  ): Promise<string> {
    const element = this.getStatusCountLocator(status);
    await expect(element).toBeVisible({ timeout });
    return (await element.textContent()) ?? "";
  }

  /**
   * 상태별 건수 숫자 반환
   * @param status - 워크로드 상태
   * @param timeout - 대기 시간
   * @returns 건수 숫자
   */
  async getStatusCount(
    status: WorkloadStatus,
    timeout = 10000,
  ): Promise<number> {
    const text = await this.getStatusCountText(status, timeout);
    return Number.parseInt(text.replace(/[,건]/g, "") || "0", 10);
  }

  /**
   * 모든 상태별 건수 반환
   * @returns { status: count } 형태의 객체
   */
  async getAllStatusCounts(): Promise<Record<WorkloadStatus, number>> {
    const result = {} as Record<WorkloadStatus, number>;
    for (const status of WORKLOAD_STATUSES) {
      result[status] = await this.getStatusCount(status);
    }
    return result;
  }

  /**
   * 개별 상태 건수의 합계 반환
   * @returns 개별 상태(running, completed, pending, failed) 건수의 합
   */
  async getIndividualStatusSum(): Promise<number> {
    let sum = 0;
    for (const status of MonitoringPage.individualStatuses) {
      sum += await this.getStatusCount(status);
    }
    return sum;
  }
}
