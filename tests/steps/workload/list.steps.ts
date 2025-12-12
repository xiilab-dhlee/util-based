import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  SELECTOR,
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../../fixtures";
import { selectDropdownOption } from "../../support/ui.helper";
import {
  CHART_MAP,
  type FilterCondition,
  JOB_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_MAP,
  WORKLOAD_BUTTON_MAP,
} from "../../support/workload.helper";

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 상수 & 타입 정의
 * 2. 목록 페이지 - 공통 (페이지 표시, 데이터 검증)
 * 3. 목록 페이지 - 필터 & 검색
 * 4. 목록 페이지 - 네비게이션 & 액션
 * 5. 상세 페이지 - 로그
 * 6. 상세 페이지 - 웹터미널
 * 7. 상세 페이지 - 모니터링
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 1. 상수 정의
// ============================================

/** 경과 시간 표시 형식 (formatElapsedTime 출력 패턴) */
const ELAPSED_TIME_REGEX =
  /^(방금 전|\d+분 전|\d+시간 전|\d+일 전|\d+일 \d+시간 전|\d+일 \d+분 전|\d+일 \d+시간 \d+분 전)$/;

/** 로그/웹터미널 페이지 버튼 셀렉터 매핑 */
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

// ============================================
// 2. 목록 페이지 - 공통
// ============================================

Then("워크로드 목록 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER));
  await expect(pageHeader).toBeVisible({ timeout: 10000 });
});

Given("목록에 워크로드가 있다", async ({ page, pageContext, $testInfo }) => {
  const workloadNames = page.locator(testId(WORKLOAD_SELECTOR.NAME));
  const count = await workloadNames.count();

  if (count === 0) {
    $testInfo.skip(true, "워크로드가 없어 시나리오를 스킵합니다");
    return;
  }

  // 첫 번째 워크로드 행 선택
  const firstRow = workloadNames.first().locator("xpath=ancestor::tr");
  pageContext.setCurrentRow(firstRow);
});

Given(
  /^목록에 상태가 (실행중|대기중|종료?|에러)인? 워크로드가 있다$/,
  async ({ page, pageContext, $testInfo }, statusName: string) => {
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
    pageContext.setCurrentRow(statusCell.locator("xpath=ancestor::tr"));
  },
);

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
// 3. 목록 페이지 - 필터 & 검색
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

/**
 * 필터 조건 설정
 * - search: "auto"면 첫 번째 워크로드 이름으로 검색, "-"면 미설정
 * - jobType: "BATCH", "INTERACTIVE", "DISTRIBUTED" 또는 "-"(미설정)
 * - status: "RUNNING", "PENDING", "ERROR", "COMPLETED" 또는 "-"(미설정)
 */
When("필터 조건을 설정한다:", async ({ page }, dataTable: DataTable) => {
  const { search, jobType, status } =
    dataTable.hashes()[0] as unknown as FilterCondition;

  // 검색어 설정 (auto: 첫 번째 워크로드 이름 사용)
  if (search !== "-") {
    const firstWorkload = page.locator(testId(WORKLOAD_SELECTOR.NAME)).first();
    const name = ((await firstWorkload.textContent()) ?? "").trim();

    const searchInput = page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
    await searchInput.fill(name);
    await searchInput.press("Enter");
    await page.waitForLoadState("networkidle");
  }

  // 잡타입 필터 설정
  if (jobType !== "-") {
    await selectDropdownOption(
      page,
      testId(WORKLOAD_SELECTOR.FILTER_JOB_TYPE),
      JOB_TYPE_LABELS[jobType] ?? jobType,
    );
  }

  // 상태 필터 설정
  if (status !== "-") {
    await selectDropdownOption(
      page,
      testId(WORKLOAD_SELECTOR.FILTER_STATUS),
      STATUS_LABELS[status] ?? status,
    );
  }
});

/** 필터 UI 상태 검증 (선택된 필터 값 표시 확인) */
Then(
  "필터 UI가 설정된 조건을 표시한다:",
  async ({ page }, dataTable: DataTable) => {
    const { search, jobType, status } =
      dataTable.hashes()[0] as unknown as FilterCondition;

    // 잡타입 필터 UI 검증
    if (jobType !== "-") {
      await expect(
        page.locator(testId(WORKLOAD_SELECTOR.FILTER_JOB_TYPE)),
      ).toContainText(JOB_TYPE_LABELS[jobType] ?? jobType);
    }

    // 상태 필터 UI 검증
    if (status !== "-") {
      await expect(
        page.locator(testId(WORKLOAD_SELECTOR.FILTER_STATUS)),
      ).toContainText(STATUS_LABELS[status] ?? status);
    }

    // 검색어 UI 검증 (값이 입력되어 있는지만 확인)
    if (search !== "-") {
      const searchInput = page.locator(testId(SELECTOR.LIST_SEARCH_INPUT));
      const value = await searchInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  },
);

// ============================================
// 4. 목록 페이지 - 네비게이션 & 액션
// ============================================

When(
  "첫 번째 워크로드의 이름을 클릭하여 상세 페이지로 이동한다",
  async ({ page }) => {
    const firstWorkloadName = page
      .locator(testId(WORKLOAD_SELECTOR.NAME))
      .first();
    await expect(firstWorkloadName).toBeVisible({ timeout: 10000 });
    await firstWorkloadName.click();
    await page.waitForLoadState("networkidle");
  },
);

When(
  /^해당 워크로드의 (로그|웹터미널|모니터링) 버튼을 클릭하여 \1 페이지로 이동한다$/,
  async ({ page, pageContext }, pageType: string) => {
    const currentRow = pageContext.assertCurrentRow();
    const button = currentRow.locator(testId(WORKLOAD_BUTTON_MAP[pageType]));
    await button.click();
    await page.waitForLoadState("networkidle");
  },
);

When(
  /^해당 워크로드의 (종료|삭제|재시작) 버튼을 클릭한다$/,
  async ({ pageContext }, buttonName: string) => {
    const currentRow = pageContext.assertCurrentRow();
    const button = currentRow.locator(testId(WORKLOAD_BUTTON_MAP[buttonName]));
    await button.click();
  },
);

Then(
  /^해당 워크로드의 (\S+) 버튼 상태가 (활성화|비활성화)이다$/,
  async ({ pageContext }, buttonName: string, state: string) => {
    const currentRow = pageContext.assertCurrentRow();
    const button = currentRow.locator(testId(WORKLOAD_BUTTON_MAP[buttonName]));
    if (state === "활성화") {
      await expect(button).toBeEnabled();
    } else {
      await expect(button).toBeDisabled();
    }
  },
);

Then(
  /^해당 워크로드의 (\S+) 버튼이 (활성화|비활성화)되어 있다$/,
  async ({ pageContext }, buttonName: string, state: string) => {
    const currentRow = pageContext.assertCurrentRow();
    const button = currentRow.locator(testId(WORKLOAD_BUTTON_MAP[buttonName]));
    if (state === "활성화") {
      await expect(button).toBeEnabled();
    } else {
      await expect(button).toBeDisabled();
    }
  },
);

// ============================================
// 5. 상세 페이지 - 로그
// ============================================

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

Then("로그 페이지 공통 UI가 표시된다", async ({ page, assertLogger }) => {
  const logViewer = page.locator(testId(WORKLOAD_SELECTOR.LOG_VIEWER));
  await expect(logViewer).toBeVisible({ timeout: 10000 });

  // 테마 적용 확인
  const className = (await logViewer.getAttribute("class")) ?? "";
  const validThemes = Object.keys(TERMINAL_THEME_LIST);
  const hasValidTheme = validThemes.some((theme) => className.includes(theme));
  assertLogger.assertEqual("로그 뷰어 테마 적용", hasValidTheme, true);

  // 로그 라인 존재 확인
  const logLines = page.locator(testId(WORKLOAD_SELECTOR.LOG_LINE));
  const count = await logLines.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // 버튼 확인
  await expect(
    page.locator(testId(WORKLOAD_SELECTOR.LOG_MONITORING_BUTTON)),
  ).toBeVisible();
  await expect(
    page.locator(testId(WORKLOAD_SELECTOR.LOG_THEME_BUTTON)),
  ).toBeVisible();
});

// ============================================
// 6. 상세 페이지 - 웹터미널
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

Then("웹터미널 페이지 공통 UI가 표시된다", async ({ page, assertLogger }) => {
  const terminalContainer = page.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
  );
  await expect(terminalContainer).toBeVisible({ timeout: 10000 });

  // 테마 적용 확인
  const className = (await terminalContainer.getAttribute("class")) ?? "";
  const validThemes = Object.keys(TERMINAL_THEME_LIST);
  const hasValidTheme = validThemes.some((theme) => className.includes(theme));
  assertLogger.assertEqual("웹터미널 테마 적용", hasValidTheme, true);

  // 버튼 확인
  await expect(
    page.locator(testId(WORKLOAD_SELECTOR.TERMINAL_MONITORING_BUTTON)),
  ).toBeVisible();
  await expect(
    page.locator(testId(WORKLOAD_SELECTOR.TERMINAL_THEME_BUTTON)),
  ).toBeVisible();
});

// ============================================
// 7. 상세 페이지 - 모니터링
// ============================================

Then(/^워크로드 (.+) 차트가 표시된다$/, async ({ page }, chartType: string) => {
  const chartId = CHART_MAP[chartType];
  const chartCard = page.locator(
    testId(WORKLOAD_SELECTOR.monitoringChart(chartId)),
  );
  await expect(chartCard).toBeVisible({ timeout: 10000 });

  const apexChart = chartCard.locator(".apexcharts-canvas");
  await expect(apexChart).toBeVisible({ timeout: 10000 });
});

Then("워크로드 모니터링 차트가 표시된다", async ({ page }) => {
  const chartTypes = [
    "cpu-usage",
    "memory-usage",
    "gpu-utilization",
    "gpu-memory",
  ];

  for (const chartId of chartTypes) {
    const chartCard = page.locator(
      testId(WORKLOAD_SELECTOR.monitoringChart(chartId)),
    );
    await expect(chartCard).toBeVisible({ timeout: 10000 });

    const apexChart = chartCard.locator(".apexcharts-canvas");
    await expect(apexChart).toBeVisible({ timeout: 10000 });
  }
});

// ============================================
// 공통 - 로그/웹터미널 페이지 버튼
// ============================================

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
