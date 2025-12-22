import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 워크로드 모니터링 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 차트 검증
 */
const { Given, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("워크로드 모니터링 페이지에 있다", async ({ workloadMonitoringPage }) => {
  await workloadMonitoringPage.goto();
});

// ============================================
// 2. 차트 검증
// ============================================

Then(
  "CPU 사용량 차트가 표시된다",
  async ({ workloadMonitoringPage, assertLogger }) => {
    await workloadMonitoringPage.assertCpuUsageChartVisible(assertLogger);
  },
);

Then(
  "메모리 사용량 차트가 표시된다",
  async ({ workloadMonitoringPage, assertLogger }) => {
    await workloadMonitoringPage.assertMemoryUsageChartVisible(assertLogger);
  },
);

Then(
  "GPU 활용률 차트가 표시된다",
  async ({ workloadMonitoringPage, assertLogger }) => {
    await workloadMonitoringPage.assertGpuUtilizationChartVisible(assertLogger);
  },
);

Then(
  "GPU 메모리 차트가 표시된다",
  async ({ workloadMonitoringPage, assertLogger }) => {
    await workloadMonitoringPage.assertGpuMemoryChartVisible(assertLogger);
  },
);
