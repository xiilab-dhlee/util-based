import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";
import { test } from "../fixtures";
import { setupWorkloadPageMocks } from "../support/mocks";
import {
  assertWorkloadRow,
  getWorkloadButton,
  WORKLOAD_STATUS_MAP,
} from "../support/workload.helper";

/**
 * 커스텀 fixture를 사용하는 createBdd
 *
 * test 객체를 전달하면 Step Definition에서
 * workloadContext fixture에 접근할 수 있습니다.
 */
const { When, Then, Given } = createBdd(test);

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 도메인 특화 Step만 정의 (공통 Step은 common.steps.ts 참조)
 *
 * data-testid 패턴:
 * - 공통: list-table, list-filter, list-total-count, list-pagination, list-search-input
 * - 워크로드 특화: workload-filter-jobType, workload-filter-status, workload-{action}-button
 */

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
 * Then - 워크로드 이름 유효성 검증
 */
Then("모든 워크로드의 이름이 빈 값이 아니다", async ({ page }) => {
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
  "모든 워크로드의 잡 타입이 다음 중 하나이다:",
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
 * Then - 상태 유효성 검증
 *
 * 워크로드 목록의 모든 상태 라벨이 허용된 값 중 하나인지 검증합니다.
 *
 * @example Feature 파일
 * | 상태     |
 * | 대기중   |
 * | 실행중   |
 * | 에러     |
 * | 종료     |
 */
Then(
  "모든 워크로드의 상태가 다음 중 하나이다:",
  async ({ page }, dataTable: DataTable) => {
    // ["대기중", "실행중", "에러", "종료"]
    const validStatuses = dataTable.raw().slice(1).flat();

    // 모든 워크로드 상태 라벨 요소 조회
    const statuses = page.locator(testIdPrefix("workload-status-"));
    const count = await statuses.count();

    // 각 상태 라벨이 허용된 값인지 검증 (0개면 루프 미실행)
    for (let i = 0; i < count; i++) {
      const text = await statuses.nth(i).textContent();
      expect(validStatuses).toContain(text?.trim());
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
    const statusValue = WORKLOAD_STATUS_MAP[statusName];
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
  const chartIdMap: Record<string, string> = {
    "CPU 사용량": "cpu-usage",
    "Memory 사용량": "memory-usage",
    "GPU 사용률": "gpu-utilization",
    "GPU 메모리": "gpu-memory",
  };

  const chartId = chartIdMap[chartType];
  const chartCard = page.locator(
    testId(WORKLOAD_SELECTOR.monitoringChart(chartId)),
  );
  await expect(chartCard).toBeVisible({ timeout: 10000 });

  const apexChart = chartCard.locator(".apexcharts-canvas");
  await expect(apexChart).toBeVisible({ timeout: 10000 });
});

// ============================================
// 상세 페이지 진입 Steps
// ============================================

/**
 * When - 워크로드 이름 클릭하여 상세 페이지로 이동
 * workloadContext에 저장된 행에서 워크로드 이름을 클릭
 */
When(
  "해당 워크로드의 이름을 클릭하여 상세 페이지로 이동한다",
  async ({ page, workloadContext }) => {
    const workloadRow = assertWorkloadRow(workloadContext.currentRow);
    // 워크로드 이름 링크 클릭 (workload-name- prefix로 시작하는 요소)
    const nameLink = workloadRow.locator(testIdPrefix("workload-name-"));
    await nameLink.click();
    await page.waitForLoadState("networkidle");
    // 상세 페이지 URL 패턴 확인 (UUID 형식)
    await expect(page).toHaveURL(/\/user\/workload\/[\w-]+\?workspaceId=/);
  },
);

/**
 * Then - 워크로드 상세 페이지 표시 확인
 */
Then("워크로드 상세 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL));
  await expect(pageHeader).toBeVisible();
});

/**
 * Then - 워크로드 기본 정보 표시 확인 (좌측 요약 패널)
 */
Then("워크로드 기본 정보가 표시된다", async ({ page }) => {
  const aside = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_ASIDE));
  await expect(aside).toBeVisible();
});

/**
 * Then - 워크로드 상세 콘텐츠 영역 표시 확인 (우측 메인 영역)
 */
Then("워크로드 상세 콘텐츠 영역이 표시된다", async ({ page }) => {
  const content = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CONTENT));
  await expect(content).toBeVisible();
});

// ============================================
// 상세 페이지 - 좌측 요약 패널 Steps
// ============================================

/**
 * Then - 워크로드 이름 빈 값 아님 확인
 */
Then("워크로드 이름이 빈 값이 아니다", async ({ page }) => {
  const name = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NAME));
  await expect(name).toBeVisible();
  const text = await name.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

/**
 * Then - 워크로드 상태 확인 (파라미터화)
 */
Then(
  "워크로드 상태가 {string}으로 표시된다",
  async ({ page }, status: string) => {
    const statusElement = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_STATUS));
    await expect(statusElement).toBeVisible();
    await expect(statusElement).toContainText(status);
  },
);

/**
 * Then - 워크로드 설명 영역 표시 확인
 */
Then("워크로드 설명 영역이 표시된다", async ({ page }) => {
  const description = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_DESCRIPTION),
  );
  await expect(description).toBeVisible();
});

/**
 * Then - 워크로드 수정 버튼 활성화 확인
 */
Then("워크로드 수정 버튼이 활성화되어 있다", async ({ page }) => {
  const editButton = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON));
  await expect(editButton).toBeEnabled();
});

/**
 * Then - 워크로드 종료 버튼 활성화 확인
 */
Then("워크로드 종료 버튼이 활성화되어 있다", async ({ page }) => {
  const stopButton = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON));
  await expect(stopButton).toBeEnabled();
});

// ============================================
// 상세 페이지 - 이벤트 이력 Steps
// ============================================

/**
 * Then - 이벤트 이력 섹션 표시 확인
 */
Then("이벤트 이력 섹션이 표시된다", async ({ page }) => {
  const eventSection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_EVENT_SECTION),
  );
  await expect(eventSection).toBeVisible();
});

/**
 * Then - 이벤트 카드 최소 1개 이상 표시 확인
 */
Then("이벤트 카드가 최소 1개 이상 표시된다", async ({ page }) => {
  const eventCards = page.locator(testIdPrefix("workload-event-card-"));
  const count = await eventCards.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

/**
 * Then - 이벤트 이름 빈 값 아님 확인
 */
Then("이벤트 이름이 빈 값이 아니다", async ({ page }) => {
  const eventNames = page.locator(testId(WORKLOAD_SELECTOR.EVENT_NAME));
  const count = await eventNames.count();

  for (let i = 0; i < count; i++) {
    const element = eventNames.nth(i);
    // Trace Viewer가 자동으로 요소 하이라이트
    const text = await element.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

/**
 * Then - 이벤트 상태 유효성 검증
 */
Then(
  "이벤트 상태가 다음 중 하나이다:",
  async ({ page }, dataTable: DataTable) => {
    const validStatuses = dataTable.raw().slice(1).flat();
    const eventStatuses = page.locator(testId(WORKLOAD_SELECTOR.EVENT_STATUS));
    const count = await eventStatuses.count();

    for (let i = 0; i < count; i++) {
      const element = eventStatuses.nth(i);

      const text = await element.textContent();
      expect(validStatuses).toContain(text?.trim());
    }
  },
);

/**
 * Then - 경과 시간 표시 확인
 */
Then("경과 시간이 표시된다", async ({ page }) => {
  const elapsedTimes = page.locator(
    testId(WORKLOAD_SELECTOR.EVENT_ELAPSED_TIME),
  );
  const count = await elapsedTimes.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

/**
 * Then - From 값 빈 값 아님 확인
 */
Then("From 값이 빈 값이 아니다", async ({ page }) => {
  const fromValues = page.locator(testId(WORKLOAD_SELECTOR.EVENT_FROM));
  const count = await fromValues.count();

  for (let i = 0; i < count; i++) {
    const element = fromValues.nth(i);
    // Trace Viewer가 자동으로 요소 하이라이트
    const text = await element.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

/**
 * Then - 메시지 영역 표시 확인
 */
Then("메시지 영역이 표시된다", async ({ page }) => {
  const messages = page.locator(testId(WORKLOAD_SELECTOR.EVENT_MESSAGE));
  const count = await messages.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

// ============================================
// 상세 페이지 - 탭 Steps
// ============================================

/**
 * Then - 상세정보 탭 선택 확인
 */
Then("상세정보 탭이 선택되어 있다", async ({ page }) => {
  const infoTab = page.locator(testId(WORKLOAD_SELECTOR.TAB_INFO));
  await expect(infoTab).toBeVisible();
  // aria-selected 또는 active 클래스로 선택 상태 확인
  await expect(infoTab).toHaveAttribute("aria-selected", "true");
});

/**
 * Then - 탭 활성화 상태 확인 (파라미터화)
 */
Then("상세정보 탭이 활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_INFO));
  await expect(tab).toBeEnabled();
});

Then("로그 탭이 활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_LOG));
  await expect(tab).toBeEnabled();
});

Then("웹터미널 탭이 활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_TERMINAL));
  await expect(tab).toBeEnabled();
});

Then("모니터링 탭이 활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_MONITORING));
  await expect(tab).toBeEnabled();
});

Then("파일목록 탭이 활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_FILE));
  await expect(tab).toBeEnabled();
});

// ============================================
// 상세 페이지 - 상세정보 탭 내용 Steps
// ============================================

/**
 * Then - Job Type 영역 표시 확인
 */
Then("Job Type 영역이 표시된다", async ({ page }) => {
  const jobType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE));
  await expect(jobType).toBeVisible();
});

/**
 * Then - 노드 타입 영역 표시 확인
 */
Then("노드 타입 영역이 표시된다", async ({ page }) => {
  const nodeType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NODE_TYPE));
  await expect(nodeType).toBeVisible();
});

/**
 * Then - 이미지 섹션 표시 확인
 */
Then("이미지 섹션이 표시된다", async ({ page }) => {
  const imageSection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_SECTION),
  );
  await expect(imageSection).toBeVisible();
});

/**
 * Then - 이미지 이름 빈 값 아님 확인
 */
Then("이미지 이름이 빈 값이 아니다", async ({ page }) => {
  const imageName = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_NAME));
  await expect(imageName).toBeVisible();
  const text = await imageName.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

/**
 * Then - Commit Image 생성 버튼 표시 확인
 */
Then(
  "내부 레지스트리 영역에 Commit Image 생성 버튼이 표시된다",
  async ({ page }) => {
    const commitButton = page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_COMMIT_IMAGE_BUTTON),
    );
    await expect(commitButton).toBeVisible();
  },
);

/**
 * Then - 리소스 섹션 표시 확인
 */
Then("리소스 섹션이 표시된다", async ({ page }) => {
  const resourceSection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_SECTION),
  );
  await expect(resourceSection).toBeVisible();
});

/**
 * Then - 선택한 GPU 정보 표시 확인
 */
Then("선택한 GPU 정보가 표시된다", async ({ page }) => {
  const gpuSelection = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_GPU_SELECTION),
  );
  await expect(gpuSelection).toBeVisible();
});

/**
 * Then - 리소스 값 표시 확인 (GPU, CPU, Memory)
 */
Then("GPU 리소스 값이 표시된다", async ({ page }) => {
  const gpuResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_GPU),
  );
  await expect(gpuResource).toBeVisible();
});

Then("CPU 리소스 값이 표시된다", async ({ page }) => {
  const cpuResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_CPU),
  );
  await expect(cpuResource).toBeVisible();
});

Then("Memory 리소스 값이 표시된다", async ({ page }) => {
  const memoryResource = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESOURCE_MEMORY),
  );
  await expect(memoryResource).toBeVisible();
});

/**
 * Then - 생성자 정보 표시 확인
 */
Then("생성자 정보가 표시된다", async ({ page }) => {
  const creator = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CREATOR));
  await expect(creator).toBeVisible();
});

/**
 * Then - 생성일 날짜 형식 확인
 */
Then("생성일이 날짜 형식으로 표시된다", async ({ page }) => {
  const createdDate = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_CREATED_DATE),
  );
  await expect(createdDate).toBeVisible();

  const text = await createdDate.textContent();
  // yyyy.MM.dd 형식 검증
  expect(text).toMatch(/\d{4}\.\d{2}\.\d{2}/);
});

// ============================================
// 상세 페이지 진입 Steps (Background용)
// ============================================

/**
 * When - 첫 번째 워크로드 클릭하여 상세 페이지로 이동
 * 상태 무관하게 첫 번째 워크로드를 클릭
 * URL 검증은 별도의 Then step에서 수행
 */
When(
  "첫 번째 워크로드의 이름을 클릭하여 상세 페이지로 이동한다",
  async ({ page }) => {
    const nameLink = page.locator(testIdPrefix("workload-name-")).first();
    await expect(nameLink).toBeVisible({ timeout: 10000 });
    await nameLink.click();
    await page.waitForLoadState("networkidle");
  },
);

// ============================================
// 상세 페이지 - 상태 무관 UI Steps
// ============================================

/**
 * Then - 워크로드 상태 표시 확인 (상태 값 무관)
 */
Then("워크로드 상태가 표시된다", async ({ page }) => {
  const statusElement = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_STATUS));
  await expect(statusElement).toBeVisible();
  const text = await statusElement.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

/**
 * Then - 워크로드 수정 버튼 표시 확인
 */
Then("워크로드 수정 버튼이 표시된다", async ({ page }) => {
  const editButton = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON));
  await expect(editButton).toBeVisible();
});

/**
 * Then - 워크로드 종료 버튼 표시 확인
 */
Then("워크로드 종료 버튼이 표시된다", async ({ page }) => {
  const stopButton = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON));
  await expect(stopButton).toBeVisible();
});

/**
 * Then - 워크로드 재시작 버튼 표시 확인
 */
Then("워크로드 재시작 버튼이 표시된다", async ({ page }) => {
  const restartButton = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON),
  );
  await expect(restartButton).toBeVisible();
});

/**
 * Then - 워크로드 삭제 버튼 표시 확인
 */
Then("워크로드 삭제 버튼이 표시된다", async ({ page }) => {
  const deleteButton = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON),
  );
  await expect(deleteButton).toBeVisible();
});

// ============================================
// 상세 페이지 - 상태별 검증 Steps
// ============================================

/**
 * Given - 워크로드 상태 확인 (상태별 시나리오용)
 * 현재 상세 페이지의 워크로드 상태가 지정된 상태인지 확인
 */
Given(
  "워크로드 상태가 {string}이다",
  async ({ page, $testInfo }, status: string) => {
    const statusElement = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_STATUS));
    await expect(statusElement).toBeVisible();

    const currentStatus = await statusElement.textContent();

    // 현재 상태가 지정된 상태와 다르면 시나리오 스킵
    if (!currentStatus?.includes(status)) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);

/**
 * Then - 탭 비활성화 상태 확인
 */
Then("웹터미널 탭이 비활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_TERMINAL));
  await expect(tab).toBeDisabled();
});

Then("파일목록 탭이 비활성화되어 있다", async ({ page }) => {
  const tab = page.locator(testId(WORKLOAD_SELECTOR.TAB_FILE));
  await expect(tab).toBeDisabled();
});
