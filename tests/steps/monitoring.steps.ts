import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { selector, USER_MONITORING_TEST_ID } from "../support/constants";
import { setupMonitoringPageMocks } from "../support/mocks";

const { When, Then } = createBdd();

/**
 * 사용자 모니터링 페이지 Step Definitions
 *
 * 공통 Step은 common.steps.ts에서 정의됨:
 * - 사용자는 로그인 상태이다
 * - 사용자는 로그인하지 않은 상태이다
 * - 워크스페이스가 선택되어 있다
 * - 워크스페이스가 선택되어 있지 않다
 * - URL이 {string}를 포함한다
 * - 로그인 페이지로 리다이렉트된다
 * - 워크스페이스 선택 안내가 표시된다
 *
 * 기반 정보:
 * - 라우트: /user/monitoring
 * - pageKey: user.monitoring
 * - 페이지 헤더: [data-testid="user.monitoring"] (PageHeader에서 pageKey 사용)
 * - 리소스 그래프: [data-testid="user-monitoring-resource-graph"]
 * - 리소스 회수 정보: [data-testid="user-monitoring-resource-recovery"]
 * - 워크로드 상태 정보: [data-testid="user-monitoring-workload-status"]
 * - 워크로드 상태별 컨테이너: [data-testid="workload-status-{status}"] (all, running, completed, pending, failed)
 * - 워크로드 상태별 건수: [data-testid="workload-status-{status}-count"]
 * - 사용 자원 정보: [data-testid="user-monitoring-resource-usage"]
 * - 실행 중 워크로드 목록: [data-testid="user-monitoring-running-workload-list"]
 * - 리소스 회수 예정 워크로드 목록: [data-testid="user-monitoring-recovery-workload-list"]
 */

/**
 * When - 모니터링 페이지 진입
 */
When("사용자가 모니터링 페이지로 진입한다", async ({ page }) => {
  await setupMonitoringPageMocks(page);
  await page.goto("/user/monitoring");
  await page.waitForLoadState("networkidle");
});

/**
 * Then - 모니터링 페이지 표시 확인
 * PageHeader의 pageKey="user.monitoring" -> data-testid="user.monitoring"
 */
Then("모니터링 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(
    selector(USER_MONITORING_TEST_ID.PAGE_HEADER),
  );
  await expect(pageHeader).toBeVisible({ timeout: 10000 });
});

/**
 * Then - CPU 그래프 표시 확인
 * ApexCharts가 렌더링 완료되었는지 .apexcharts-canvas로 확인
 */
Then("CPU 그래프가 표시된다", async ({ page }) => {
  const resourceGraph = page.locator(
    selector(USER_MONITORING_TEST_ID.RESOURCE_GRAPH),
  );
  await expect(resourceGraph).toBeVisible({ timeout: 10000 });

  // ApexCharts가 렌더링 완료되었는지 확인
  const chart = resourceGraph.locator(".apexcharts-canvas");
  await expect(chart).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 리소스 회수 정보 표시 확인 (GPU/CPU/Memory 카드)
 * ApexCharts(radialBar)가 렌더링 완료되었는지 .apexcharts-canvas로 확인
 */
Then("리소스 회수 정보가 표시된다", async ({ page }) => {
  const resourceRecovery = page.locator(
    selector(USER_MONITORING_TEST_ID.RESOURCE_RECOVERY),
  );
  await expect(resourceRecovery).toBeVisible({ timeout: 10000 });

  // ApexCharts(radialBar)가 렌더링 완료되었는지 확인
  const chart = resourceRecovery.locator(".apexcharts-canvas");
  await expect(chart).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 워크로드 정보 표시 확인
 */
Then("워크로드 정보가 표시된다", async ({ page }) => {
  const workloadStatus = page.locator(
    selector(USER_MONITORING_TEST_ID.WORKLOAD_STATUS),
  );
  await expect(workloadStatus).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 사용 자원 정보 표시 확인
 */
Then("사용 자원 정보가 표시된다", async ({ page }) => {
  const resourceUsage = page.locator(
    selector(USER_MONITORING_TEST_ID.RESOURCE_USAGE),
  );
  await expect(resourceUsage).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 실행 중 워크로드 목록 표시 확인
 * Ant Design Table이 렌더링 완료되었는지 .ant-table-tbody로 확인
 */
Then("실행 중 워크로드 목록이 표시된다", async ({ page }) => {
  const runningWorkloadList = page.locator(
    selector(USER_MONITORING_TEST_ID.RUNNING_WORKLOAD_LIST),
  );
  await expect(runningWorkloadList).toBeVisible({ timeout: 10000 });

  // 테이블이 렌더링 완료되었는지 확인
  const tableBody = runningWorkloadList.locator(".ant-table-tbody");
  await expect(tableBody).toBeVisible({ timeout: 10000 });
});

/**
 * Then - 리소스 회수 예정 워크로드 목록 표시 확인
 * Ant Design Table이 렌더링 완료되었는지 .ant-table-tbody로 확인
 */
Then("리소스 회수 예정 워크로드 목록이 표시된다", async ({ page }) => {
  const recoveryWorkloadList = page.locator(
    selector(USER_MONITORING_TEST_ID.RECOVERY_WORKLOAD_LIST),
  );
  await expect(recoveryWorkloadList).toBeVisible({ timeout: 10000 });

  // 테이블이 렌더링 완료되었는지 확인
  const tableBody = recoveryWorkloadList.locator(".ant-table-tbody");
  await expect(tableBody).toBeVisible({ timeout: 10000 });
});

// ============================================
// 워크로드 상태 상세 검증 Steps
// ============================================

const WORKLOAD_STATUSES = ["all", "running", "completed", "pending", "failed"];

/**
 * Then - 워크로드 상태별 건수 표시 확인
 * 각 상태(전체, 실행중, 완료, 대기중, 실패)별로 건수가 "n건" 형식으로 표시되는지 확인
 */
Then("워크로드 상태별 건수가 표시된다", async ({ page }) => {
  for (const status of WORKLOAD_STATUSES) {
    const countElement = page.locator(
      selector(USER_MONITORING_TEST_ID.statusCount(status)),
    );
    await expect(countElement).toBeVisible({ timeout: 10000 });

    // "n건" 형식인지 확인
    const text = await countElement.textContent();
    expect(text).toMatch(/[\d,]+건/);
  }
});

/**
 * Then - 상태별 건수 합계 검증
 * 개별 상태(running, completed, pending, failed)의 건수 합이 전체(all) 건수와 일치하는지 확인
 */
Then("상태별 건수의 합이 전체 건수와 일치한다", async ({ page }) => {
  // 전체 건수 가져오기
  const allCountElement = page.locator(
    selector(USER_MONITORING_TEST_ID.statusCount("all")),
  );
  const allText = await allCountElement.textContent();
  const allCount = Number.parseInt(allText?.replace(/[,건]/g, "") ?? "0", 10);

  // 개별 상태 건수 합계 계산
  let sum = 0;
  const individualStatuses = ["running", "completed", "pending", "failed"];

  for (const status of individualStatuses) {
    const countElement = page.locator(
      selector(USER_MONITORING_TEST_ID.statusCount(status)),
    );
    const text = await countElement.textContent();
    const count = Number.parseInt(text?.replace(/[,건]/g, "") ?? "0", 10);
    sum += count;
  }

  // 전체 건수와 개별 상태 합계가 일치하는지 확인
  expect(sum).toBe(allCount);
});
