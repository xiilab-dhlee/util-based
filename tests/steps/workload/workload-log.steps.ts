import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  ANT_SELECTOR,
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";

/**
 * 워크로드 로그 페이지 Step Definitions
 *
 * 구조:
 * 0. 페이지 진입
 * 1. 로그 검증
 * 2. 테마 변경 결과 확인
 * 3. 모니터링 사이드 패널
 * 4. 모니터링 차트 확대
 *
 * NOTE: 테마 변경 관련 step은 common.steps.ts에서 공통 관리
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 0. 페이지 진입
// ============================================

/**
 * 실행중 또는 종료된 워크로드의 로그 페이지로 이동한 상태
 * - running 상태 워크로드 우선 시도
 * - 없으면 completed 상태 워크로드 시도
 * - 둘 다 없으면 시나리오 스킵
 */
Given(
  "실행중 또는 종료된 워크로드 로그 페이지에 있다",
  async ({ workloadListPage, workloadLogPage, $testInfo }) => {
    await workloadListPage.goto();

    // running 먼저 시도, 없으면 completed 시도
    let row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      "running",
    );
    if (!row) {
      row = await workloadListPage.table.findRowByStatus(
        "workload-status-",
        "completed",
      );
    }
    if (!row) {
      $testInfo.skip(
        true,
        "실행중 또는 종료된 워크로드가 없어 시나리오를 스킵합니다",
      );
      return;
    }

    // 로그 버튼 클릭하여 로그 페이지로 이동
    await workloadListPage.table.clickRowButton(
      row,
      WorkloadListPage.ROW_BUTTON.로그,
    );

    // 로그 페이지가 표시될 때까지 대기
    await workloadLogPage.assertPageVisible();
  },
);

Then("워크로드 로그 페이지가 표시된다", async ({ workloadLogPage }) => {
  await workloadLogPage.assertPageVisible();
});

// ============================================
// 1. 로그 검증
// ============================================

Then(
  "로그 영역에 하나 이상의 로그 라인이 존재한다",
  async ({ workloadLogPage }) => {
    const count = await workloadLogPage.getLogLineCount();
    expect(count).toBeGreaterThanOrEqual(1);
  },
);

// ============================================
// 2. 테마 변경 결과 확인
// ============================================

Then(
  "로그 영역에 선택한 테마가 표시된다",
  async ({ workloadLogPage, themeContext }) => {
    const logViewer = workloadLogPage.logViewer;
    await expect(logViewer).toBeVisible({ timeout: 5000 });

    // 선택된 테마를 context에서 가져옴
    const selectedTheme = themeContext.assertSelectedTheme();

    // 선택한 테마 클래스가 정확히 적용되었는지 확인
    const className = (await logViewer.getAttribute("class")) ?? "";
    expect(
      className.includes(selectedTheme),
      `Expected log viewer to have theme class "${selectedTheme}", but got: ${className}`,
    ).toBe(true);
  },
);

// ============================================
// 3. 모니터링 사이드 패널
// ============================================

When("모니터링 버튼을 클릭한다", async ({ workloadLogPage }) => {
  await workloadLogPage.clickMonitoringButton();
});

Then("모니터링 사이드 패널이 표시된다", async ({ page }) => {
  const panel = page.locator(testId(WORKLOAD_SELECTOR.ASIDE_MONITORING));
  await expect(panel).toBeVisible({ timeout: 5000 });
});

// ============================================
// 4. 모니터링 차트 확대
// ============================================

When("차트 확대 버튼을 클릭한다", async ({ page }) => {
  const expandButton = page
    .locator(testId(WORKLOAD_SELECTOR.MONITORING_CHART_EXPAND_BUTTON))
    .first();
  await expect(expandButton).toBeVisible({ timeout: 5000 });
  await expandButton.click();
});

Then("차트 확대 모달이 표시된다", async ({ page }) => {
  const modal = page.locator(ANT_SELECTOR.MODAL);
  await expect(modal).toBeVisible({ timeout: 5000 });
});
