import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  testId,
  USER_MONITORING_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { setupMonitoringPageMocks } from "../../support/mocks";

const { When, Then } = createBdd(test);

/**
 * 사용자 모니터링 페이지 Step Definitions
 */

// ============================================
// 페이지 진입 Steps
// ============================================

When("사용자가 모니터링 페이지로 진입한다", async ({ page }) => {
  await setupMonitoringPageMocks(page);
  await page.goto("/user/monitoring");
  await page.waitForLoadState("networkidle");
});

Then("모니터링 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(USER_MONITORING_SELECTOR.PAGE_HEADER));
  await expect(pageHeader).toBeVisible({ timeout: 10000 });
});

// ============================================
// 리소스 그래프 Steps
// ============================================

Then("CPU 그래프가 표시된다", async ({ page }) => {
  const resourceGraph = page.locator(
    testId(USER_MONITORING_SELECTOR.RESOURCE_GRAPH),
  );
  await expect(resourceGraph).toBeVisible({ timeout: 10000 });

  const chart = resourceGraph.locator(".apexcharts-canvas");
  await expect(chart).toBeVisible({ timeout: 10000 });
});

Then("리소스 회수 정보가 표시된다", async ({ page }) => {
  const resourceRecovery = page.locator(
    testId(USER_MONITORING_SELECTOR.RESOURCE_RECOVERY),
  );
  await expect(resourceRecovery).toBeVisible({ timeout: 10000 });

  const chart = resourceRecovery.locator(".apexcharts-canvas");
  await expect(chart).toBeVisible({ timeout: 10000 });
});

// ============================================
// 워크로드 정보 Steps
// ============================================

Then("워크로드 정보가 표시된다", async ({ page }) => {
  const workloadStatus = page.locator(
    testId(USER_MONITORING_SELECTOR.WORKLOAD_STATUS),
  );
  await expect(workloadStatus).toBeVisible({ timeout: 10000 });
});

Then("사용 자원 정보가 표시된다", async ({ page }) => {
  const resourceUsage = page.locator(
    testId(USER_MONITORING_SELECTOR.RESOURCE_USAGE),
  );
  await expect(resourceUsage).toBeVisible({ timeout: 10000 });
});

Then("실행 중 워크로드 목록이 표시된다", async ({ page }) => {
  const runningWorkloadList = page.locator(
    testId(USER_MONITORING_SELECTOR.RUNNING_WORKLOAD_LIST),
  );
  await expect(runningWorkloadList).toBeVisible({ timeout: 10000 });

  const tableBody = runningWorkloadList.locator(".ant-table-tbody");
  await expect(tableBody).toBeVisible({ timeout: 10000 });
});

Then("리소스 회수 예정 워크로드 목록이 표시된다", async ({ page }) => {
  const recoveryWorkloadList = page.locator(
    testId(USER_MONITORING_SELECTOR.RECOVERY_WORKLOAD_LIST),
  );
  await expect(recoveryWorkloadList).toBeVisible({ timeout: 10000 });

  const tableBody = recoveryWorkloadList.locator(".ant-table-tbody");
  await expect(tableBody).toBeVisible({ timeout: 10000 });
});

// ============================================
// 워크로드 상태 상세 검증 Steps
// ============================================

const WORKLOAD_STATUSES = ["all", "running", "completed", "pending", "failed"];

Then("워크로드 상태별 건수가 표시된다", async ({ page, assertLogger }) => {
  for (const status of WORKLOAD_STATUSES) {
    const countElement = page.locator(
      testId(USER_MONITORING_SELECTOR.statusCount(status)),
    );
    await expect(countElement).toBeVisible({ timeout: 10000 });

    const text = (await countElement.textContent()) ?? "";
    assertLogger.assertMatch(`${status} 건수 형식`, text, /[\d,]+건/);
  }
});

Then(
  "상태별 건수의 합이 전체 건수와 일치한다",
  async ({ page, assertLogger }) => {
    const allCountElement = page.locator(
      testId(USER_MONITORING_SELECTOR.statusCount("all")),
    );
    const allText = await allCountElement.textContent();
    const allCount = Number.parseInt(allText?.replace(/[,건]/g, "") ?? "0", 10);

    let sum = 0;
    const individualStatuses = ["running", "completed", "pending", "failed"];

    for (const status of individualStatuses) {
      const countElement = page.locator(
        testId(USER_MONITORING_SELECTOR.statusCount(status)),
      );
      const text = await countElement.textContent();
      sum += Number.parseInt(text?.replace(/[,건]/g, "") ?? "0", 10);
    }

    assertLogger.assertEqual("상태별 건수 합계", sum, allCount);
  },
);
