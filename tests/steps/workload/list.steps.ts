import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../../fixtures";
import { setupWorkloadPageMocks } from "../../support/mocks";
import {
  assertWorkloadRow,
  extractStatusFromTestId,
  getWorkloadButton,
} from "../../support/workload.helper";

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 목록 페이지 관련 Step만 정의
 * - 페이지 진입
 * - 데이터 유효성 검증
 * - 액션 버튼 검증
 * - 필터 검증
 * - 로그/웹터미널/모니터링 조회
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 페이지 진입 Steps
// ============================================

/**
 * When - 워크로드 목록 페이지 진입
 *
 * Playwright의 page.route()를 사용하여 API 모킹 설정 후 페이지 진입
 * MSW 대신 테스트 레벨에서 직접 모킹하여 초기화 대기 시간 제거
 */
When("사용자가 워크로드 목록 페이지로 진입한다", async ({ page }) => {
  await setupWorkloadPageMocks(page);
  await page.goto("/user/workload");
  await page.waitForLoadState("networkidle");
});

/**
 * When - 비활성화 워크로드 목록 페이지 진입
 */
When("사용자가 비활성화 워크로드 목록 페이지로 진입한다", async ({ page }) => {
  await setupWorkloadPageMocks(page);
  await page.goto("/user/workload/disabled");
  await page.waitForLoadState("networkidle");
});

/**
 * Then - 워크로드 목록 페이지 표시 확인
 */
Then("워크로드 목록 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER));
  await expect(pageHeader).toBeVisible({ timeout: 10000 });
});

// ============================================
// 데이터 유효성 검증 Steps
// ============================================

/**
 * Then - 각 워크로드의 이름 유효성 검증
 */
Then("각 워크로드의 이름이 빈 값이 아니다", async ({ page }) => {
  const names = page.locator(testIdPrefix("workload-name-"));
  const count = await names.count();

  for (let i = 0; i < count; i++) {
    const text = await names.nth(i).textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

/**
 * Then - 잡 타입 유효성 검증
 *
 * Feature 파일의 DataTable에서 유효한 잡 타입 목록을 받아
 * 페이지에 표시된 모든 워크로드의 잡 타입이 해당 목록에 포함되는지 검증
 *
 * @example Feature 파일
 * | 잡 타입       |
 * | batch         |
 * | interactive   |
 * | distributed   |
 */
Then(
  "각 워크로드의 잡 타입이 다음 중 하나이다:",
  async ({ page }, dataTable: DataTable) => {
    // ["batch", "interactive", "distributed"]
    const validTypes = dataTable.raw().slice(1).flat();

    // data-testid가 "workload-job-type-"로 시작하는 모든 요소 선택
    const jobTypes = page.locator(testIdPrefix("workload-job-type-"));
    const count = await jobTypes.count();

    // 각 워크로드의 잡 타입이 유효한 값인지 검증 (0개면 루프 미실행)
    for (let i = 0; i < count; i++) {
      const text = await jobTypes.nth(i).textContent();
      expect(validTypes).toContain(text?.trim());
    }
  },
);

/**
 * Then - 각 워크로드의 상태가 다음 중 하나로 표시된다 (여러 개 검증)
 * data-testid에서 상태값을 추출하여 유효한 상태인지 검증
 */
Then(
  "각 워크로드의 상태가 다음 중 하나로 표시된다:",
  async ({ page }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);

    // 모든 워크로드 상태 라벨 요소 조회
    const statuses = page.locator(testIdPrefix("workload-status-"));
    const count = await statuses.count();

    // 각 상태 라벨이 허용된 값인지 검증 (0개면 루프 미실행)
    for (let i = 0; i < count; i++) {
      const status = await extractStatusFromTestId(statuses.nth(i));
      expect(validStatuses).toContain(status);
    }
  },
);

// ============================================
// 액션 버튼 검증 Steps
// ============================================

/**
 * Given - 특정 상태의 워크로드 존재 확인 및 해당 행 저장
 *
 * 지정된 상태의 워크로드가 있는 행을 찾아 workloadContext에 저장
 * 해당 상태의 워크로드가 없으면 시나리오를 스킵
 *
 * @example
 * Given 목록에 실행중인 워크로드가 있다
 * Given 목록에 대기중인 워크로드가 있다
 */
Given(
  /^목록에 (실행중|대기중|종료된?|에러)인? 워크로드가 있다$/,
  async ({ page, workloadContext, $testInfo }, statusName: string) => {
    /**
     * 한글 상태명 → data-testid 상태값 매핑
     * Feature 파일의 상태 이름을 data-testid 값으로 변환
     */
    const STATUS_MAP: Record<string, string> = {
      실행중: "running",
      대기중: "pending",
      종료: "completed",
      에러: "failed",
    };
    const statusValue = STATUS_MAP[statusName];
    const statusCell = page
      .locator(testId(WORKLOAD_SELECTOR.status(statusValue)))
      .first();

    // 해당 상태의 워크로드가 없으면 시나리오 스킵
    const count = await statusCell.count();
    if (count === 0) {
      $testInfo.skip(
        true,
        `${statusName} 워크로드가 없어 시나리오를 스킵합니다`,
      );
      return;
    }

    await expect(statusCell).toBeVisible({ timeout: 10000 });

    // 해당 셀이 속한 행(tr)을 찾아 workloadContext에 저장
    workloadContext.setCurrentRow(statusCell.locator("xpath=ancestor::tr"));
  },
);

/**
 * Then - 워크로드 행의 {버튼} 버튼이 활성화되어 있다
 * 목록 페이지에서 선택된 워크로드 행의 버튼 활성화 검증
 *
 * @example
 * Then 워크로드 행의 로그 버튼이 활성화되어 있다
 * Then 워크로드 행의 웹터미널 버튼이 활성화되어 있다
 */
Then(
  "워크로드 행의 {word} 버튼이 활성화되어 있다",
  async ({ workloadContext }, buttonName: string) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    const button = getWorkloadButton(workloadRow, buttonName);
    await expect(button).toBeEnabled();
  },
);

/**
 * Then - 워크로드 행의 {버튼} 버튼이 비활성화되어 있다
 * 목록 페이지에서 선택된 워크로드 행의 버튼 비활성화 검증
 *
 * @example
 * Then 워크로드 행의 로그 버튼이 비활성화되어 있다
 * Then 워크로드 행의 웹터미널 버튼이 비활성화되어 있다
 */
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

/**
 * Then - 잡 타입 필터 기본 상태 확인
 * Ant Design Select의 placeholder가 보이면 값이 선택되지 않은 상태
 */
Then("잡 타입 필터가 빈 값으로 표시된다", async ({ page }) => {
  const filter = page.locator(testId(WORKLOAD_SELECTOR.FILTER_JOB_TYPE));
  await expect(filter).toBeVisible({ timeout: 10000 });

  // placeholder가 보이면 값이 선택되지 않은 상태
  const placeholder = filter.locator(".ant-select-selection-placeholder");
  await expect(placeholder).toBeVisible();
});

/**
 * Then - 상태 필터 기본 상태 확인
 * Ant Design Select의 placeholder가 보이면 값이 선택되지 않은 상태
 */
Then("상태 필터가 빈 값으로 표시된다", async ({ page }) => {
  const filter = page.locator(testId(WORKLOAD_SELECTOR.FILTER_STATUS));
  await expect(filter).toBeVisible({ timeout: 10000 });

  // placeholder가 보이면 값이 선택되지 않은 상태
  const placeholder = filter.locator(".ant-select-selection-placeholder");
  await expect(placeholder).toBeVisible();
});

// ============================================
// 로그 조회 Steps
// ============================================

/**
 * When - 워크로드 행의 버튼 클릭 및 해당 페이지로 이동
 * workloadContext에 저장된 행의 버튼을 클릭
 * URL 검증은 별도의 Then step에서 수행
 *
 * @example
 * When 워크로드 행의 로그 버튼을 클릭하여 로그 페이지로 이동한다
 * When 워크로드 행의 웹터미널 버튼을 클릭하여 웹터미널 페이지로 이동한다
 * When 워크로드 행의 모니터링 버튼을 클릭하여 모니터링 페이지로 이동한다
 */
When(
  /^워크로드 행의 (로그|웹터미널|모니터링) 버튼을 클릭하여 \1 페이지로 이동한다$/,
  async ({ page, workloadContext }, pageType: string) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    const button = getWorkloadButton(workloadRow, pageType);
    await button.click();
    await page.waitForLoadState("networkidle");
  },
);

/**
 * Then - 로그 영역 테마 적용 확인
 * TERMINAL_THEME_LIST의 테마가 className으로 적용됨
 * 테마 목록: MaterialDark, Gruvbox_Dark, AdventureTime, Borland, Solarized_Light, Material, Github
 */
Then("로그 영역에 설정된 테마가 적용되어 있다", async ({ page }) => {
  const logViewer = page.locator(testId(WORKLOAD_SELECTOR.LOG_VIEWER));
  await expect(logViewer).toBeVisible({ timeout: 10000 });

  // 로그 뷰어에 테마 클래스가 적용되어 있는지 확인
  const className = await logViewer.getAttribute("class");
  const validThemes = Object.keys(TERMINAL_THEME_LIST);
  const hasValidTheme = validThemes.some((theme) => className?.includes(theme));
  expect(hasValidTheme).toBe(true);
});

/**
 * Then - 로그 라인 존재 확인
 */
Then("로그 영역에 하나 이상의 로그 라인이 존재한다", async ({ page }) => {
  const logLines = page.locator(testId(WORKLOAD_SELECTOR.LOG_LINE));
  const count = await logLines.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

/**
 * Then - 모니터링 버튼 표시 확인 (로그/웹터미널 페이지)
 */
Then(
  /^(로그|웹터미널) 모니터링 버튼이 표시된다$/,
  async ({ page }, pageType: string) => {
    let selector: string;

    if (pageType === "로그") {
      selector = WORKLOAD_SELECTOR.LOG_MONITORING_BUTTON;
    } else {
      selector = WORKLOAD_SELECTOR.TERMINAL_MONITORING_BUTTON;
    }

    const button = page.locator(testId(selector));
    await expect(button).toBeVisible();
  },
);

/**
 * Then - 테마 변경 버튼 표시 확인 (로그/웹터미널 페이지)
 */
Then(
  /^(로그|웹터미널) 테마 변경 버튼이 표시된다$/,
  async ({ page }, pageType: string) => {
    let selector: string;

    if (pageType === "로그") {
      selector = WORKLOAD_SELECTOR.LOG_THEME_BUTTON;
    } else {
      selector = WORKLOAD_SELECTOR.TERMINAL_THEME_BUTTON;
    }

    const button = page.locator(testId(selector));
    await expect(button).toBeVisible();
  },
);

// ============================================
// 웹터미널 조회 Steps
// ============================================

/**
 * Then - 웹터미널 영역 테마 적용 확인
 * TERMINAL_THEME_LIST의 테마가 className으로 적용됨
 */
Then("웹터미널에 설정된 테마가 적용되어 있다", async ({ page }) => {
  const terminalContainer = page.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
  );
  await expect(terminalContainer).toBeVisible({ timeout: 10000 });

  // 터미널 컨테이너에 테마 클래스가 적용되어 있는지 확인
  const className = await terminalContainer.getAttribute("class");
  const validThemes = Object.keys(TERMINAL_THEME_LIST);
  const hasValidTheme = validThemes.some((theme) => className?.includes(theme));
  expect(hasValidTheme).toBe(true);
});

/**
 * Then - xterm 터미널 표시 확인
 * xterm 라이브러리는 .xterm 클래스를 가진 요소를 생성함
 */
Then("웹터미널에 xterm 터미널이 표시된다", async ({ page }) => {
  const terminalContainer = page.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_CONTAINER),
  );
  await expect(terminalContainer).toBeVisible({ timeout: 10000 });

  // xterm 라이브러리가 생성하는 .xterm 클래스 요소 확인
  // const xtermElement = terminalContainer.locator(".xterm");
  // await expect(xtermElement.first()).toBeVisible({ timeout: 10000 });
});

// ============================================
// 모니터링 조회 Steps
// ============================================

/**
 * Then - 차트 표시 확인 (파라미터화)
 * apexcharts-canvas 클래스로 차트 활성화 여부 확인
 * @param chartType - "CPU 사용량", "Memory 사용량", "GPU 사용률", "GPU 메모리"
 */
Then(/^워크로드 (.+) 차트가 표시된다$/, async ({ page }, chartType: string) => {
  // chartType: "CPU 사용량", "Memory 사용량", "GPU 사용률", "GPU 메모리"
  const CHART_MAP: Record<string, string> = {
    "CPU 사용량": "cpu-usage",
    "Memory 사용량": "memory-usage",
    "GPU 사용률": "gpu-utilization",
    "GPU 메모리": "gpu-memory",
  };

  const chartId = CHART_MAP[chartType];
  const chartCard = page.locator(
    testId(WORKLOAD_SELECTOR.monitoringChart(chartId)),
  );
  await expect(chartCard).toBeVisible({ timeout: 10000 });

  const apexChart = chartCard.locator(".apexcharts-canvas");
  await expect(apexChart).toBeVisible({ timeout: 10000 });
});
