import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";
import type { FilterCondition } from "../../support/types";

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 목록 페이지 - 공통 (페이지 표시)
 * 2. 목록 페이지 - 필터 & 검색
 * 3. 목록 페이지 - 네비게이션 & 액션
 * 4. 상세 페이지 - 로그
 * 5. 상세 페이지 - 웹터미널
 * 6. 상세 페이지 - 모니터링
 *
 * 도메인 상수: WorkloadListPage.ROW_BUTTON, CHART_ID, PAGE_BUTTON
 *
 * NOTE: 데이터 유효성 검증 Step은 tests/archives/steps/data-validation.steps.ts로 이동됨
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
  "목록에 상태가 {string}인 워크로드가 있다",
  async ({ workloadListPage, listContext, $testInfo }, status: string) => {
    const row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      status,
    );

    if (!row) {
      $testInfo.skip(true, `${status} 워크로드가 없어 시나리오를 스킵합니다`);
      return;
    }

    listContext.setCurrentRow(row);
  },
);

// ============================================
// 2. 목록 페이지 - 필터 & 검색
// ============================================

/**
 * 필터 조건 설정
 * - search: "auto"면 첫 번째 워크로드 이름으로 검색, "-"면 미설정
 * - jobType: UI에 표시되는 값 ("Batch", "Interactive" 등) 또는 "-"(미설정)
 * - status: UI에 표시되는 값 ("실행중", "대기중" 등) 또는 "-"(미설정)
 */
When(
  "필터 조건을 설정한다:",
  async ({ workloadListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { search, jobType, status } = rows[0] as unknown as FilterCondition;

    // 검색어 설정 (auto: 첫 번째 워크로드 이름 사용)
    if (search === "auto") {
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
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { search, jobType, status } = rows[0] as unknown as FilterCondition;

    // 잡타입 필터 UI 검증
    if (jobType !== "-") {
      await workloadListPage.jobTypeFilter.assertContainsText(jobType);
    }

    // 상태 필터 UI 검증
    if (status !== "-") {
      await workloadListPage.statusFilter.assertContainsText(status);
    }

    // 검색어 UI 검증 (auto인 경우 값이 입력되어 있는지 확인)
    if (search === "auto") {
      const value = await workloadListPage.getSearchInputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  },
);

/** UI 상태 라벨 → data-testid 상태값 매핑 */
const STATUS_LABEL_TO_API: Record<string, string> = {
  실행중: "running",
  대기중: "pending",
  에러: "error",
  종료: "completed",
};

/**
 * 필터링된 목록 결과 검증
 * - 목록의 모든 워크로드가 필터 조건에 맞는지 확인
 * - 검색어: 워크로드 이름에 검색어가 포함되어 있는지 확인
 * - 잡타입/상태: 각 행의 값이 필터 조건과 일치하는지 확인
 */
Then(
  "필터링된 목록이 조건에 맞게 표시된다:",
  async ({ workloadListPage, assertLogger }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { search, jobType, status } = rows[0] as unknown as FilterCondition;

    const rowCount = await workloadListPage.table.getRowCount();

    // 목록이 비어있으면 검증 스킵 (데이터가 없는 경우도 필터링 성공)
    if (rowCount === 0) {
      return;
    }

    // 잡타입 검증 (UI는 소문자로 표시되므로 대소문자 무시 비교)
    if (jobType !== "-") {
      await workloadListPage.table.forEachCell(
        WORKLOAD_SELECTOR.JOB_TYPE,
        (text, i) => {
          assertLogger.assertEqual(
            `워크로드[${i}] 잡타입`,
            text.toLowerCase(),
            jobType.toLowerCase(),
          );
        },
      );
    }

    // 상태 검증
    if (status !== "-") {
      const expectedStatus = STATUS_LABEL_TO_API[status] ?? status;
      await workloadListPage.table.forEachByPrefix(
        "workload-status-",
        (statusValue, i) => {
          assertLogger.assertEqual(
            `워크로드[${i}] 상태`,
            statusValue,
            expectedStatus,
          );
        },
      );
    }

    // 검색어 검증 (auto인 경우 검색창의 값을 기준으로 검증)
    if (search === "auto") {
      const searchText = await workloadListPage.getSearchInputValue();
      await workloadListPage.table.forEachCell(
        WORKLOAD_SELECTOR.NAME,
        (text, i) => {
          const containsSearch = text
            .toLowerCase()
            .includes(searchText.toLowerCase());
          assertLogger.assertEqual(
            `워크로드[${i}] 이름이 "${searchText}" 포함`,
            containsSearch,
            true,
          );
        },
      );
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
    const button = currentRow.locator(
      testId(WorkloadListPage.ROW_BUTTON[buttonName]),
    );
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
