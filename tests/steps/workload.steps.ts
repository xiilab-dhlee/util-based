import { expect, type Locator } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  SELECTOR,
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { setupWorkloadPageMocks } from "../support/mocks";

const { When, Then, Given } = createBdd();

// ============================================
// Step 간 공유 컨텍스트
// ============================================

/**
 * 현재 테스트 중인 워크로드 행을 저장
 * Given 단계에서 특정 상태의 워크로드를 찾아 저장하고
 * Then 단계에서 해당 행의 버튼을 검증하는 데 사용
 */
let currentWorkloadRow: Locator | null = null;

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
  // API 모킹 설정 (페이지 진입 전에 설정해야 함)
  await setupWorkloadPageMocks(page);

  // 페이지 진입
  await page.goto("/user/workload");
  await page.waitForLoadState("networkidle");
});

/**
 * When - 비활성화 워크로드 목록 페이지 진입
 */
When("사용자가 비활성화 워크로드 목록 페이지로 진입한다", async ({ page }) => {
  // API 모킹 설정 (페이지 진입 전에 설정해야 함)
  await setupWorkloadPageMocks(page);

  // 페이지 진입
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
// 탭 검증 Steps
// ============================================

/**
 * Then - 탭 선택 상태 확인
 */
Then(
  "상단 탭 영역에서 {string} 탭이 선택되어 있다",
  async ({ page }, tabName: string) => {
    // RouteTab은 현재 경로 기반으로 활성 탭 결정
    // 활성화 탭 = /user/workload, 비활성화 탭 = /user/workload/disabled
    if (tabName === "활성화") {
      await expect(page).toHaveURL(/\/user\/workload$/);
    } else {
      await expect(page).toHaveURL(/\/user\/workload\/disabled/);
    }
  },
);

// ============================================
// 워크로드 상태 검증 Steps
// ============================================

/**
 * Then - 활성 상태 워크로드 표시 확인
 */
Then("워크로드 목록에 활성 상태의 워크로드가 표시된다", async ({ page }) => {
  const table = page.locator(testId(SELECTOR.LIST_TABLE));
  await expect(table).toBeVisible({ timeout: 10000 });

  // 테이블 행이 최소 1개 이상인지 확인
  const rows = table.locator(".ant-table-tbody tr.ant-table-row");
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

/**
 * Then - 종료 상태 워크로드 미표시 확인
 */
Then("종료 상태의 워크로드는 목록에 표시되지 않는다", async ({ page }) => {
  const completedStatus = page.locator(
    testId(WORKLOAD_SELECTOR.status("completed")),
  );

  await expect(completedStatus).toHaveCount(0);
});

/**
 * Then - 종료 상태 워크로드 표시 확인 (비활성화 탭)
 */
Then("워크로드 목록에 종료 상태의 워크로드가 표시된다", async ({ page }) => {
  const table = page.locator(testId(SELECTOR.LIST_TABLE));
  await expect(table).toBeVisible({ timeout: 10000 });

  // 테이블 행이 최소 1개 이상인지 확인
  const rows = table.locator(".ant-table-tbody tr.ant-table-row");
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

/**
 * Then - 활성 상태 워크로드 미표시 확인 (비활성화 탭)
 */
Then("활성 상태의 워크로드는 목록에 표시되지 않는다", async ({ page }) => {
  const runningStatus = page.locator(
    testId(WORKLOAD_SELECTOR.status("running")),
  );
  const pendingStatus = page.locator(
    testId(WORKLOAD_SELECTOR.status("pending")),
  );

  await expect(runningStatus).toHaveCount(0);
  await expect(pendingStatus).toHaveCount(0);
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
    // DataTable 파싱:
    // 1. dataTable.raw() → [["잡 타입"], ["batch"], ["interactive"], ["distributed"]]
    // 2. .slice(1) → [["batch"], ["interactive"], ["distributed"]] (헤더 제외)
    // 3. .flat() → ["batch", "interactive", "distributed"] (1차원 배열로 평탄화)
    const validTypes = dataTable.raw().slice(1).flat();

    // data-testid가 "workload-job-type-"로 시작하는 모든 요소 선택
    // 예: workload-job-type-abc123, workload-job-type-def456
    const jobTypes = page.locator(testIdPrefix("workload-job-type-"));

    // 선택된 요소의 개수 (= 테이블에 표시된 워크로드 수)
    const count = await jobTypes.count();

    // 각 워크로드의 잡 타입이 유효한 값인지 검증
    for (let i = 0; i < count; i++) {
      // i번째 요소의 텍스트 콘텐츠 가져오기 (예: "batch")
      const text = await jobTypes.nth(i).textContent();

      // 해당 텍스트가 유효한 잡 타입 목록에 포함되는지 확인
      // 포함되지 않으면 테스트 실패
      expect(validTypes).toContain(text?.trim());
    }
  },
);

/**
 * Then - 상태 유효성 검증
 */
Then(
  "모든 워크로드의 상태가 다음 중 하나이다:",
  async ({ page }, dataTable: DataTable) => {
    const validStatuses = dataTable.raw().slice(1).flat();
    const statuses = page.locator(testIdPrefix("workload-status-"));
    const count = await statuses.count();

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
 * Given - 실행중인 워크로드 존재 확인 및 해당 행 저장
 *
 * "실행중" 상태의 워크로드가 있는 행을 찾아 currentWorkloadRow에 저장
 * 이후 Then 단계에서 해당 행의 버튼을 검증하는 데 사용
 * 실행중인 워크로드가 없으면 시나리오를 스킵
 */
Given("목록에 실행중인 워크로드가 있다", async ({ page, $testInfo }) => {
  // "실행중" 텍스트가 있는 상태 셀 찾기
  const runningStatusCell = page
    .locator(`${testIdPrefix("workload-status-")}:has-text("실행중")`)
    .first();

  // 실행중인 워크로드가 없으면 시나리오 스킵
  const count = await runningStatusCell.count();
  if (count === 0) {
    $testInfo.skip(true, "실행중인 워크로드가 없어 시나리오를 스킵합니다");
    return;
  }

  await expect(runningStatusCell).toBeVisible({ timeout: 10000 });

  // 해당 셀이 속한 행(tr)을 찾아 저장
  currentWorkloadRow = runningStatusCell.locator("xpath=ancestor::tr");
});

/**
 * Then - 로그 버튼 활성화 확인
 * currentWorkloadRow에 저장된 행의 로그 버튼이 활성화되어 있는지 확인
 */
Then("해당 워크로드의 로그 버튼이 활성화되어 있다", async () => {
  if (!currentWorkloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  const logButton = currentWorkloadRow.locator(
    testId(WORKLOAD_SELECTOR.LOG_BUTTON),
  );
  await expect(logButton).toBeEnabled();
});

/**
 * Then - 웹터미널 버튼 활성화 확인
 */
Then("해당 워크로드의 웹터미널 버튼이 활성화되어 있다", async () => {
  if (!currentWorkloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  const terminalButton = currentWorkloadRow.locator(
    testId(WORKLOAD_SELECTOR.TERMINAL_BUTTON),
  );
  await expect(terminalButton).toBeEnabled();
});

/**
 * Then - 모니터링 버튼 활성화 확인
 */
Then("해당 워크로드의 모니터링 버튼이 활성화되어 있다", async () => {
  if (!currentWorkloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  const monitoringButton = currentWorkloadRow.locator(
    testId(WORKLOAD_SELECTOR.MONITORING_BUTTON),
  );
  await expect(monitoringButton).toBeEnabled();
});

/**
 * Then - 모든 워크로드의 종료 버튼 활성화 확인
 */
Then("모든 워크로드의 종료 버튼이 활성화되어 있다", async ({ page }) => {
  const stopButtons = page.locator(testId(WORKLOAD_SELECTOR.STOP_BUTTON));
  const count = await stopButtons.count();

  for (let i = 0; i < count; i++) {
    await expect(stopButtons.nth(i)).toBeEnabled();
  }
});

// ============================================
// 비활성화 워크로드 액션 버튼 검증 Steps
// ============================================

/**
 * Given - 종료된 워크로드 존재 확인 및 해당 행 저장
 *
 * 비활성화 탭에서 첫 번째 워크로드 행을 찾아 currentWorkloadRow에 저장
 * 종료된 워크로드가 없으면 시나리오를 스킵
 */
Given("목록에 종료된 워크로드가 있다", async ({ page, $testInfo }) => {
  const disabledStatusCell = page
    .locator(testIdPrefix("workload-status-"))
    .first();

  // 종료된 워크로드가 없으면 시나리오 스킵
  const count = await disabledStatusCell.count();
  if (count === 0) {
    $testInfo.skip(true, "종료된 워크로드가 없어 시나리오를 스킵합니다");
    return;
  }

  await expect(disabledStatusCell).toBeVisible({ timeout: 10000 });

  // 해당 셀이 속한 행(tr)을 찾아 저장
  currentWorkloadRow = disabledStatusCell.locator("xpath=ancestor::tr");
});

/**
 * Then - 삭제 버튼 활성화 확인
 */
Then("해당 워크로드의 삭제 버튼이 활성화되어 있다", async () => {
  if (!currentWorkloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  const deleteButton = currentWorkloadRow.locator(
    testId(WORKLOAD_SELECTOR.DELETE_BUTTON),
  );
  await expect(deleteButton).toBeEnabled();
});

/**
 * Then - 재시작 버튼 활성화 확인
 */
Then("해당 워크로드의 재시작 버튼이 활성화되어 있다", async () => {
  if (!currentWorkloadRow) {
    throw new Error(
      "워크로드 행이 설정되지 않았습니다. Given 단계를 먼저 실행하세요.",
    );
  }
  const restartButton = currentWorkloadRow.locator(
    testId(WORKLOAD_SELECTOR.RESTART_BUTTON),
  );
  await expect(restartButton).toBeEnabled();
});

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
