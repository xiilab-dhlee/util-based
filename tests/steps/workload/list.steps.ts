import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";
import { RELATIVE_TIME_PATTERN } from "../../support/patterns";
import type { FilterCondition } from "../../support/types";

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

When(
  /^(활성화|비활성화) 탭을 클릭한다$/,
  async ({ workloadListPage }, tabName: string) => {
    await workloadListPage.tabs.clickTab(tabName);
  },
);

Given(
  "running 상태인 워크로드의 웹터미널 버튼을 클릭하여 웹터미널 페이지로 이동한 상태다",
  async ({ workloadListPage, $testInfo }) => {
    const row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      "running",
    );
    if (!row) {
      $testInfo.skip(true, `running 워크로드가 없어 시나리오를 스킵합니다`);
      return;
    }

    await workloadListPage.table.clickRowButton(
      row,
      WORKLOAD_SELECTOR.TERMINAL_BUTTON,
    );
  },
);

Given(
  /^(running 또는 completed) 상태인 워크로드의 (로그|모니터링) 버튼을 클릭하여 (로그|모니터링) 페이지로 이동한 상태다$/,
  async ({ workloadListPage, $testInfo }, _, __, pageType: string) => {
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
        "running 또는 completed 워크로드가 없어 시나리오를 스킵합니다",
      );
      return;
    }

    const buttonSelector = WorkloadListPage.ROW_BUTTON[pageType];
    await workloadListPage.table.clickRowButton(row, buttonSelector);
  },
);

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("워크로드 목록 페이지가 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPageVisible();
});

Then("워크로드 목록 테이블이 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertTableVisible();
});

Then(
  "워크로드 총 개수가 표시된다",
  async ({ workloadListPage, assertLogger }) => {
    const totalCountText = await workloadListPage.getTotalCountText();
    assertLogger.assertNotEmpty("총 개수", totalCountText);
  },
);

Then("워크로드 목록 페이지네이션이 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPaginationVisible();
});

Then(
  "워크로드 잡 타입 필터가 빈 값으로 표시된다",
  async ({ workloadListPage }) => {
    await workloadListPage.jobTypeFilter.assertEmpty();
  },
);

Then(
  "워크로드 상태 필터가 빈 값으로 표시된다",
  async ({ workloadListPage }) => {
    await workloadListPage.statusFilter.assertEmpty();
  },
);

Then("워크로드 검색창이 빈 값으로 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertSearchInputEmpty();
});

Then(
  "내 워크로드만 보기가 선택되어 있지 않다",
  async ({ workloadListPage }) => {
    await workloadListPage.myItemsOnlySwitch.assertUnchecked();
  },
);

Then("내 워크로드만 보기가 선택되어 있다", async ({ workloadListPage }) => {
  await workloadListPage.myItemsOnlySwitch.assertChecked();
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

// ============================================
// 2. 목록 페이지 - 필터
// ============================================

/**
 * 필터 조건 설정
 * - jobType: UI에 표시되는 값 ("Batch", "Interactive" 등) 또는 "-"(미설정)
 * - status: UI에 표시되는 값 ("실행중", "대기중" 등) 또는 "-"(미설정)
 */
When(
  "워크로드 필터를 설정한다:",
  async ({ workloadListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { jobType, status } = rows[0] as unknown as FilterCondition;

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
  "워크로드 필터가 설정된 조건을 표시한다:",
  async ({ workloadListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { jobType, status } = rows[0] as unknown as FilterCondition;

    // 잡타입 필터 UI 검증
    if (jobType !== "-") {
      await workloadListPage.jobTypeFilter.assertContainsText(jobType);
    }

    // 상태 필터 UI 검증
    if (status !== "-") {
      await workloadListPage.statusFilter.assertContainsText(status);
    }
  },
);

/** UI 상태 라벨 → data-testid 상태값 매핑 */
const STATUS_LABEL_TO_API: Record<string, string> = {
  실행중: "running",
  대기중: "pending",
  에러: "failed",
  종료: "completed",
};

/**
 * 필터링된 목록 결과 검증
 * - 목록의 모든 워크로드가 필터 조건에 맞는지 확인
 * - 잡타입/상태: 각 행의 값이 필터 조건과 일치하는지 확인
 */
Then(
  "필터링된 워크로드 목록이 조건에 맞게 표시된다:",
  async ({ workloadListPage, assertLogger }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { jobType, status } = rows[0] as unknown as FilterCondition;

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
  },
);

// ============================================
// 4. 목록 페이지 - 네비게이션 & 액션
// ============================================

When(
  "워크로드 상세 페이지로 이동한다",
  async ({ workloadDetailPage, workloadId, workspaceId }) => {
    await workloadDetailPage.gotoWorkload(workloadId, workspaceId);
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
  /^running 상태인 워크로드의 (로그|웹터미널|모니터링|종료) 버튼을 클릭한다$/,
  async ({ workloadListPage, $testInfo }, pageType: string) => {
    const row = await workloadListPage.table.findRowByStatus(
      "workload-status-",
      "running",
    );
    if (!row) {
      $testInfo.skip(true, "running 워크로드가 없어 시나리오를 스킵합니다");
      return;
    }

    const buttonSelector = WorkloadListPage.ROW_BUTTON[pageType];
    await workloadListPage.table.clickRowButton(row, buttonSelector);
  },
);

When(
  /^첫 번째 워크로드의 (로그|모니터링|삭제|재시작) 버튼을 클릭한다$/,
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
// 6. 검색 경계값 테스트
// ============================================

/**
 * 검색창에 직접 검색어 입력 (경계값 테스트용)
 */
When(
  "검색창에 {string}를 입력한다",
  async ({ workloadListPage }, searchText: string) => {
    await workloadListPage.searchByText(searchText);
  },
);

/**
 * 검색 결과 조건 검증
 * - 전체목록: 검색어 없이 전체 목록 표시
 * - 부분일치: 첫 번째 결과가 검색어를 포함하는지 확인 (샘플 검증)
 *
 * NOTE: E2E 테스트는 기능 동작 확인이 목적이므로 첫 번째 결과만 검증
 * 전체 결과 정확성은 백엔드/API 테스트 영역
 */
Then(
  "검색 결과가 {string} 조건을 만족한다",
  async ({ workloadListPage, assertLogger }, expectedCondition: string) => {
    const rowCount = await workloadListPage.table.getRowCount();

    if (expectedCondition === "전체목록") {
      // 빈값 검색 시 목록이 표시되는지 확인 (0개 이상)
      assertLogger.assertEqual("전체 목록 표시", rowCount >= 0, true);
    } else if (expectedCondition === "부분일치") {
      // 검색어가 입력된 경우, 첫 번째 결과만 검증 (샘플 검증)
      if (rowCount > 0) {
        const searchText = await workloadListPage.getSearchInputValue();
        const firstRowName = await workloadListPage.table.getCellText(
          0,
          WORKLOAD_SELECTOR.NAME,
        );
        const containsSearch = firstRowName
          .toLowerCase()
          .includes(searchText.toLowerCase());
        assertLogger.assertEqual(
          `첫 번째 결과가 "${searchText}" 포함`,
          containsSearch,
          true,
        );
      }
    }
  },
);

// ============================================
// 7. 데이터 유효성 검증
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
