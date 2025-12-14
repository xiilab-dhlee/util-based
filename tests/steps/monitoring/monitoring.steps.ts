import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";
import { MonitoringPage } from "../../pages/monitoring.page";

/**
 * 사용자 모니터링 페이지 Step Definitions
 *
 * Page Objects:
 * - monitoringPage: 모니터링 페이지 (리소스 그래프, 워크로드 상태 등)
 *   - resourceGraph: CPU 리소스 그래프
 *   - resourceRecovery: 리소스 회수 정보 차트
 *   - workloadStatusChart: 워크로드 상태 정보
 *   - runningWorkloadList: 실행 중 워크로드 목록
 *   - recoveryWorkloadList: 리소스 회수 예정 목록
 */
const { Then } = createBdd(test);

// ============================================
// 페이지 표시 확인 Steps
// ============================================

Then("모니터링 페이지가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.assertPageVisible();
});

// ============================================
// 리소스 그래프 Steps
// ============================================

Then("CPU 그래프가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.resourceGraph.assertVisible();
});

Then("리소스 회수 정보가 표시된다", async ({ monitoringPage }) => {
  await monitoringPage.resourceRecovery.assertVisible();
});

// ============================================
// 워크로드 정보 Steps
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
// 워크로드 상태 상세 검증 Steps
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
