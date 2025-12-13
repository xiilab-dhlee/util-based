import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import { testId, WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";
import { RELATIVE_TIME_PATTERN } from "../../support/patterns";
import type { FilterCondition } from "../../support/types";

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 목록 페이지 - 공통 (페이지 표시, 데이터 검증)
 * 2. 목록 페이지 - 필터 & 검색
 * 3. 목록 페이지 - 네비게이션 & 액션
 * 4. 상세 페이지 - 로그
 * 5. 상세 페이지 - 웹터미널
 * 6. 상세 페이지 - 모니터링
 *
 * 도메인 상수: WorkloadListPage.STATUS_MAP, ROW_BUTTON, CHART_ID, PAGE_BUTTON
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 2. 목록 페이지 - 공통
// ============================================

Then("워크로드 목록 페이지가 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPageVisible();
});

Given(
  "목록에 워크로드가 있다",
  async ({ workloadListPage, listContext, $testInfo }) => {
    const count = await workloadListPage.table.getRowCount();

    if (count === 0) {
      $testInfo.skip(true, "워크로드가 없어 시나리오를 스킵합니다");
      return;
    }

    // 첫 번째 워크로드 행 선택
    const firstRow = await workloadListPage.table.getFirstRow();
    listContext.setCurrentRow(firstRow);
  },
);

Given(
  /^목록에 상태가 (실행중|대기중|종료?|에러)인? 워크로드가 있다$/,
  async ({ workloadListPage, listContext, $testInfo }, statusName: string) => {
    const statusValue = WorkloadListPage.STATUS_MAP[statusName];
    const row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      statusValue,
    );

    if (!row) {
      $testInfo.skip(
        true,
        `${statusName} 워크로드가 없어 시나리오를 스킵합니다`,
      );
      return;
    }

    listContext.setCurrentRow(row);
  },
);

Then(
  "각 워크로드의 이름이 빈 값이 아니다",
  async ({ workloadListPage, assertLogger }) => {
    await workloadListPage.table.forEachCell(
      WORKLOAD_SELECTOR.NAME,
      (text, i) => {
        assertLogger.assertNotEmpty(`워크로드[${i}] 이름`, text);
      },
    );
  },
);

Then(
  "각 워크로드의 잡 타입이 다음 중 하나이다:",
  async ({ workloadListPage, assertLogger }, dataTable: DataTable) => {
    const validTypes = dataTable.raw().slice(1).flat();

    await workloadListPage.table.forEachCell(
      WORKLOAD_SELECTOR.JOB_TYPE,
      (text, i) => {
        assertLogger.assertContains(`워크로드[${i}] 잡 타입`, text, validTypes);
      },
    );
  },
);

Then(
  "각 워크로드의 상태가 다음 중 하나로 표시된다:",
  async ({ workloadListPage, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);

    await workloadListPage.table.forEachByPrefix(
      "workload-status-",
      (status, i) => {
        assertLogger.assertContains(
          `워크로드[${i}] 상태`,
          status,
          validStatuses,
        );
      },
    );
  },
);

Then(
  "각 워크로드의 경과 시간이 올바른 형식으로 표시된다",
  async ({ workloadListPage, assertLogger }) => {
    await workloadListPage.table.forEachCell(
      WORKLOAD_SELECTOR.ELAPSED_TIME,
      (text, i) => {
        assertLogger.assertMatch(
          `워크로드[${i}] 경과 시간`,
          text,
          RELATIVE_TIME_PATTERN,
        );
      },
    );
  },
);

// ============================================
// 3. 목록 페이지 - 필터 & 검색
// ============================================

Then("잡 타입 필터가 빈 값으로 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.jobTypeFilter.assertEmpty();
});

Then("상태 필터가 빈 값으로 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.statusFilter.assertEmpty();
});

/**
 * 필터 조건 설정
 * - search: "auto"면 첫 번째 워크로드 이름으로 검색, "-"면 미설정
 * - jobType: UI에 표시되는 값 ("Batch", "Interactive" 등) 또는 "-"(미설정)
 * - status: UI에 표시되는 값 ("실행중", "대기중" 등) 또는 "-"(미설정)
 */
When(
  "필터 조건을 설정한다:",
  async ({ workloadListPage }, dataTable: DataTable) => {
    const { search, jobType, status } =
      dataTable.hashes()[0] as unknown as FilterCondition;

    // 검색어 설정 (auto: 첫 번째 워크로드 이름 사용)
    if (search !== "-") {
      await workloadListPage.searchByFirstWorkloadName();
    }

    // 잡타입 필터 설정 (Feature에서 UI 텍스트 직접 사용)
    if (jobType !== "-") {
      await workloadListPage.jobTypeFilter.select(jobType);
    }

    // 상태 필터 설정 (Feature에서 UI 텍스트 직접 사용)
    if (status !== "-") {
      await workloadListPage.statusFilter.select(status);
    }
  },
);

/** 필터 UI 상태 검증 (선택된 필터 값 표시 확인) */
Then(
  "필터 UI가 설정된 조건을 표시한다:",
  async ({ workloadListPage }, dataTable: DataTable) => {
    const { search, jobType, status } =
      dataTable.hashes()[0] as unknown as FilterCondition;

    // 잡타입 필터 UI 검증
    if (jobType !== "-") {
      await workloadListPage.jobTypeFilter.assertContainsText(jobType);
    }

    // 상태 필터 UI 검증
    if (status !== "-") {
      await workloadListPage.statusFilter.assertContainsText(status);
    }

    // 검색어 UI 검증 (값이 입력되어 있는지만 확인)
    if (search !== "-") {
      const value = await workloadListPage.getSearchInputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  },
);

// ============================================
// 4. 목록 페이지 - 네비게이션 & 액션
// ============================================

When(
  "첫 번째 워크로드의 이름을 클릭하여 상세 페이지로 이동한다",
  async ({ workloadListPage }) => {
    await workloadListPage.table.clickFirstCell(WORKLOAD_SELECTOR.NAME);
  },
);

When(
  /^해당 워크로드의 (로그|웹터미널|모니터링) 버튼을 클릭하여 \1 페이지로 이동한다$/,
  async ({ workloadListPage, listContext }, pageType: string) => {
    const currentRow = listContext.assertCurrentRow();
    await workloadListPage.table.clickRowButton(
      currentRow,
      WorkloadListPage.ROW_BUTTON[pageType],
    );
  },
);

When(
  /^해당 워크로드의 (종료|삭제|재시작) 버튼을 클릭한다$/,
  async ({ workloadListPage, listContext }, buttonName: string) => {
    const currentRow = listContext.assertCurrentRow();
    await workloadListPage.table.clickRowButton(
      currentRow,
      WorkloadListPage.ROW_BUTTON[buttonName],
    );
  },
);

/**
 * 버튼 활성화 상태 검증
 * - "해당 워크로드의 {버튼} 버튼 상태가 {활성화|비활성화}이다"
 * - "해당 워크로드의 {버튼} 버튼이 {활성화|비활성화}되어 있다"
 * 두 패턴 모두 지원
 */
Then(
  /^해당 워크로드의 (\S+) 버튼(?:이| 상태가) (활성화|비활성화)(?:이다|되어 있다)$/,
  async ({ listContext }, buttonName: string, state: string) => {
    const currentRow = listContext.assertCurrentRow();
    const button = currentRow.locator(testId(WorkloadListPage.ROW_BUTTON[buttonName]));
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

// ============================================
// 7. 상세 페이지 - 모니터링
// ============================================

Then(/^워크로드 (.+) 차트가 표시된다$/, async ({ page }, chartType: string) => {
  const chartId = WorkloadListPage.CHART_ID[chartType];
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
      page.locator(testId(WorkloadListPage.PAGE_BUTTON[pageType].monitoring)),
    ).toBeVisible();
  },
);

Then(
  /^(로그|웹터미널) 테마 변경 버튼이 표시된다$/,
  async ({ page }, pageType: string) => {
    await expect(
      page.locator(testId(WorkloadListPage.PAGE_BUTTON[pageType].theme)),
    ).toBeVisible();
  },
);
