import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";
import { RELATIVE_TIME_PATTERN } from "../../support/patterns";

/**
 * 워크로드 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 페이지 표시 검증
 * 3. 필터 & 검색
 * 4. 테이블 행 액션
 * 5. 데이터 유효성 검증
 *
 * 도메인 상수: WorkloadListPage.ROW_BUTTON
 *
 * NOTE: 모니터링 관련 Step은 monitoring.steps.ts로 분리됨
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("활성화 워크로드 목록 페이지에 있다", async ({ workloadListPage }) => {
  await workloadListPage.goto();
});

When("활성화 워크로드 목록 페이지로 이동한다", async ({ workloadListPage }) => {
  await workloadListPage.goto();
});

Given("비활성화 워크로드 목록 페이지에 있다", async ({ workloadListPage }) => {
  await workloadListPage.gotoDisabled();
});

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("워크로드 목록 페이지가 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPageVisible();
});

When(
  "목록에 상태가 {string}인 워크로드를 바라본다",
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

When(
  "첫 번째 워크로드의 이름을 클릭한다",
  async ({ workloadListPage, $testInfo }) => {
    const count = await workloadListPage.table.getRowCount();
    if (count === 0) {
      $testInfo.skip(true, "워크로드가 없어 시나리오를 스킵합니다");
      return;
    }
    await workloadListPage.table.clickFirstCell(WORKLOAD_SELECTOR.NAME);
  },
);

When(
  /^실행중인 워크로드의 (로그|웹터미널|모니터링|종료) 버튼을 클릭한다$/,
  async ({ workloadListPage, $testInfo }, pageType: string) => {
    const row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      "running",
    );
    if (!row) {
      $testInfo.skip(true, "실행 중인 워크로드가 없어 시나리오를 스킵합니다");
      return;
    }

    const buttonSelector = WorkloadListPage.ROW_BUTTON[pageType];
    await workloadListPage.table.clickRowButton(row, buttonSelector);
  },
);

When(
  /^실행중 또는 종료된 워크로드의 (로그|모니터링) 버튼을 클릭한다$/,
  async ({ workloadListPage, $testInfo }, buttonName: string) => {
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

    const buttonSelector = WorkloadListPage.ROW_BUTTON[buttonName];
    await workloadListPage.table.clickRowButton(row, buttonSelector);
  },
);

When(
  /^첫 번째 워크로드의 (로그|모니터링|종료|삭제|재시작) 버튼을 클릭한다$/,
  async ({ workloadListPage, $testInfo }, buttonName: string) => {
    const count = await workloadListPage.table.getRowCount();
    if (count === 0) {
      $testInfo.skip(true, "워크로드가 없어 시나리오를 스킵합니다");
      return;
    }
    const firstRow = await workloadListPage.table.getRow(0);
    await workloadListPage.table.clickRowButton(
      firstRow,
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
// 5. 데이터 유효성 검증
// ============================================

/**
 * 각 워크로드의 이름이 빈 값이 아닌지 검증
 */
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

/**
 * 각 워크로드의 생성자가 빈 값이 아닌지 검증
 */
Then(
  "각 워크로드의 생성자가 빈 값이 아니다",
  async ({ workloadListPage, assertLogger }) => {
    await workloadListPage.table.forEachCell(
      WORKLOAD_SELECTOR.CREATOR_NAME,
      (text, i) => {
        assertLogger.assertNotEmpty(`워크로드[${i}] 생성자`, text);
      },
    );
  },
);

/**
 * 각 워크로드의 잡 타입이 유효한 값 중 하나인지 검증
 */
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

/**
 * 각 워크로드의 상태가 유효한 값 중 하나인지 검증
 */
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

/**
 * 각 워크로드의 경과 시간이 올바른 형식으로 표시되는지 검증
 *
 * 권장: 이 검증은 Unit 테스트로 대체
 * - formatElapsedTime() 함수의 입출력 테스트로 충분
 */
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
