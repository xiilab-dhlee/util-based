import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../../fixtures";
import {
  assertWorkloadRow,
  getWorkloadButton,
} from "../../support/workload.helper";

/**
 * 워크로드 목록 페이지 Step Definitions
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 페이지 진입 Steps
// ============================================

When("사용자가 워크로드 목록 페이지로 진입한다", async ({ page }) => {
  // 모킹은 인증 Hook에서 설정됨
  await page.goto("/user/workload");
  await page.waitForLoadState("networkidle");
});

When("사용자가 비활성화 워크로드 목록 페이지로 진입한다", async ({ page }) => {
  // 모킹은 인증 Hook에서 설정됨
  await page.goto("/user/workload/disabled");
  await page.waitForLoadState("networkidle");
});

Then("워크로드 목록 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER));
  await expect(pageHeader).toBeVisible({ timeout: 10000 });
});

// ============================================
// 데이터 유효성 검증 Steps
// ============================================

Then("각 워크로드의 이름이 빈 값이 아니다", async ({ page, assertLogger }) => {
  const names = page.locator(testId(WORKLOAD_SELECTOR.NAME));
  const count = await names.count();

  for (let i = 0; i < count; i++) {
    const text = await names.nth(i).textContent();
    assertLogger.assertNotEmpty(`워크로드[${i}] 이름`, text);
  }
});

Then(
  "각 워크로드의 잡 타입이 다음 중 하나이다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validTypes = dataTable.raw().slice(1).flat();
    const jobTypes = page.locator(testId(WORKLOAD_SELECTOR.JOB_TYPE));
    const count = await jobTypes.count();

    for (let i = 0; i < count; i++) {
      const text = (await jobTypes.nth(i).textContent())?.trim() ?? "";
      assertLogger.assertContains(`워크로드[${i}] 잡 타입`, text, validTypes);
    }
  },
);

Then(
  "각 워크로드의 상태가 다음 중 하나로 표시된다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);
    const statuses = page.locator(testIdPrefix("workload-status-"));
    const count = await statuses.count();

    for (let i = 0; i < count; i++) {
      const testIdValue = await statuses.nth(i).getAttribute("data-testid");
      const status = testIdValue?.replace("workload-status-", "") ?? "";
      assertLogger.assertContains(`워크로드[${i}] 상태`, status, validStatuses);
    }
  },
);

// formatElapsedTime 출력 패턴: "방금 전", "N분 전", "N시간 전", "N일 전", "N일 N시간 전", "N일 N분 전", "N일 N시간 N분 전"
const ELAPSED_TIME_REGEX =
  /^(방금 전|\d+분 전|\d+시간 전|\d+일 전|\d+일 \d+시간 전|\d+일 \d+분 전|\d+일 \d+시간 \d+분 전)$/;

Then(
  "각 워크로드의 경과 시간이 올바른 형식으로 표시된다",
  async ({ page, assertLogger }) => {
    const elapsedTimes = page.locator(testId(WORKLOAD_SELECTOR.ELAPSED_TIME));
    const count = await elapsedTimes.count();

    for (let i = 0; i < count; i++) {
      const text = (await elapsedTimes.nth(i).textContent())?.trim() ?? "";
      assertLogger.assertMatch(
        `워크로드[${i}] 경과 시간`,
        text,
        ELAPSED_TIME_REGEX,
      );
    }
  },
);

// ============================================
// 액션 버튼 검증 Steps
// ============================================

const STATUS_MAP: Record<string, string> = {
  실행중: "running",
  대기중: "pending",
  종료: "completed",
  에러: "failed",
};

Given(
  /^목록에 상태가 (실행중|대기중|종료?|에러)인? 워크로드가 있다$/,
  async ({ page, workloadContext, $testInfo }, statusName: string) => {
    const statusValue = STATUS_MAP[statusName];
    const statusCell = page
      .locator(testId(WORKLOAD_SELECTOR.status(statusValue)))
      .first();

    const count = await statusCell.count();
    if (count === 0) {
      $testInfo.skip(
        true,
        `${statusName} 워크로드가 없어 시나리오를 스킵합니다`,
      );
      return;
    }

    await expect(statusCell).toBeVisible({ timeout: 10000 });
    workloadContext.setCurrentRow(statusCell.locator("xpath=ancestor::tr"));
  },
);

Then(
  "워크로드 행의 {word} 버튼이 활성화되어 있다",
  async ({ workloadContext }, buttonName: string) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    const button = getWorkloadButton(workloadRow, buttonName);
    await expect(button).toBeEnabled();
  },
);

Then(
  "워크로드 행의 {word} 버튼이 비활성화되어 있다",
  async ({ workloadContext }, buttonName: string) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    const button = getWorkloadButton(workloadRow, buttonName);
    await expect(button).toBeDisabled();
  },
);

// ============================================
// 워크로드 필터 검증 Steps
// ============================================

Then("잡 타입 필터가 빈 값으로 표시된다", async ({ page }) => {
  const filter = page.locator(testId(WORKLOAD_SELECTOR.FILTER_JOB_TYPE));
  await expect(filter).toBeVisible({ timeout: 10000 });

  const placeholder = filter.locator(".ant-select-selection-placeholder");
  await expect(placeholder).toBeVisible();
});

Then("상태 필터가 빈 값으로 표시된다", async ({ page }) => {
  const filter = page.locator(testId(WORKLOAD_SELECTOR.FILTER_STATUS));
  await expect(filter).toBeVisible({ timeout: 10000 });

  const placeholder = filter.locator(".ant-select-selection-placeholder");
  await expect(placeholder).toBeVisible();
});

// ============================================
// 로그 조회 Steps
// ============================================

When(
  /^워크로드 행의 (로그|웹터미널|모니터링) 버튼을 클릭하여 \1 페이지로 이동한다$/,
  async ({ page, workloadContext }, pageType: string) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    const button = getWorkloadButton(workloadRow, pageType);
    await button.click();
    await page.waitForLoadState("networkidle");
  },
);

Then(
  "로그 영역에 설정된 테마가 적용되어 있다",
  async ({ page, assertLogger }) => {
    const logViewer = page.locator(testId(WORKLOAD_SELECTOR.LOG_VIEWER));
    await expect(logViewer).toBeVisible({ timeout: 10000 });

    const className = (await logViewer.getAttribute("class")) ?? "";
    const validThemes = Object.keys(TERMINAL_THEME_LIST);
    const hasValidTheme = validThemes.some((theme) =>
      className.includes(theme),
    );
    assertLogger.assertEqual("로그 뷰어 테마 적용", hasValidTheme, true);
  },
);

Then("로그 영역에 하나 이상의 로그 라인이 존재한다", async ({ page }) => {
  const logLines = page.locator(testId(WORKLOAD_SELECTOR.LOG_LINE));
  const count = await logLines.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

const PAGE_BUTTON_MAP: Record<string, { monitoring: string; theme: string }> = {
  로그: {
    monitoring: WORKLOAD_SELECTOR.LOG_MONITORING_BUTTON,
    theme: WORKLOAD_SELECTOR.LOG_THEME_BUTTON,
  },
  웹터미널: {
    monitoring: WORKLOAD_SELECTOR.TERMINAL_MONITORING_BUTTON,
    theme: WORKLOAD_SELECTOR.TERMINAL_THEME_BUTTON,
  },
};

Then(
  /^(로그|웹터미널) 모니터링 버튼이 표시된다$/,
  async ({ page }, pageType: string) => {
    await expect(
      page.locator(testId(PAGE_BUTTON_MAP[pageType].monitoring)),
    ).toBeVisible();
  },
);

Then(
  /^(로그|웹터미널) 테마 변경 버튼이 표시된다$/,
  async ({ page }, pageType: string) => {
    await expect(
      page.locator(testId(PAGE_BUTTON_MAP[pageType].theme)),
    ).toBeVisible();
  },
);

// ============================================
// 웹터미널 조회 Steps
// ============================================

Then(
  "웹터미널에 설정된 테마가 적용되어 있다",
  async ({ page, assertLogger }) => {
    const terminalContainer = page.locator(
      testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
    );
    await expect(terminalContainer).toBeVisible({ timeout: 10000 });

    const className = (await terminalContainer.getAttribute("class")) ?? "";
    const validThemes = Object.keys(TERMINAL_THEME_LIST);
    const hasValidTheme = validThemes.some((theme) =>
      className.includes(theme),
    );
    assertLogger.assertEqual("웹터미널 테마 적용", hasValidTheme, true);
  },
);

Then("웹터미널에 xterm 터미널이 표시된다", async ({ page }) => {
  const terminalContainer = page.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
  );
  await expect(terminalContainer).toBeVisible({ timeout: 10000 });
});

// ============================================
// 모니터링 조회 Steps
// ============================================

const CHART_MAP: Record<string, string> = {
  "CPU 사용량": "cpu-usage",
  "Memory 사용량": "memory-usage",
  "GPU 사용률": "gpu-utilization",
  "GPU 메모리": "gpu-memory",
};

Then(/^워크로드 (.+) 차트가 표시된다$/, async ({ page }, chartType: string) => {
  const chartId = CHART_MAP[chartType];
  const chartCard = page.locator(
    testId(WORKLOAD_SELECTOR.monitoringChart(chartId)),
  );
  await expect(chartCard).toBeVisible({ timeout: 10000 });

  const apexChart = chartCard.locator(".apexcharts-canvas");
  await expect(apexChart).toBeVisible({ timeout: 10000 });
});
