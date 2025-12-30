import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";
import { MonitoringPage } from "../../pages/monitoring.page";

/**
 * 사용자 모니터링 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 페이지 표시 확인
 * 3. 리소스 그래프
 * 4. 워크로드 정보
 * 5. 워크로드 상태 상세 검증
 */
const { Given, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("모니터링 페이지에 있다", async ({ monitoringPage }) => {
  await monitoringPage.goto();
});

// ============================================
// 2. 페이지 표시 확인
// ============================================

Then("모니터링 페이지가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.assertPageVisible();
});

// ============================================
// 3. 리소스 그래프
// ============================================

Then("CPU 그래프가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.resourceGraph.assertVisible();
});

Then("리소스 회수 정보가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.resourceRecovery.assertVisible();
});

// ============================================
// 4. 워크로드 정보
// ============================================

Then("워크로드 정보가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.workloadStatusChart.assertContainerVisible();
});

Then("사용 자원 정보가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.assertResourceUsageVisible();
});

Then("실행 중 워크로드 목록이 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.runningWorkloadList.assertTableVisible();
});

Then(
  "리소스 회수 예정 워크로드 목록이 표시된다",
  async ({ monitoringPage }) => {
    await monitoringPage.recoveryWorkloadList.assertTableVisible();
  },
);

// ============================================
// 5. 워크로드 상태 상세 검증
// ============================================

Then(
  "워크로드 상태별 건수가 표시된다",
  async ({ monitoringPage, assertLogger }) => {
    for (const status of MonitoringPage.statuses) {
      const text = await monitoringPage.getStatusCountText(status);
      assertLogger.assertMatch(`${status} 건수 형식`, text, /[\d,]+건/);
    }
  },
);

Then(
  "상태별 건수의 합이 전체 건수와 일치한다",
  async ({ monitoringPage, assertLogger }) => {
    const allCount = await monitoringPage.getStatusCount("all");
    const sum = await monitoringPage.getIndividualStatusSum();

    assertLogger.assertEqual("상태별 건수 합계", sum, allCount);
  },
);
