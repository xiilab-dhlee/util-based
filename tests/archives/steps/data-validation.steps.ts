/**
 * ============================================
 * ARCHIVED: 2025-12-15
 * 사유: E2E 테스트로 적합하지 않음 (Unit 테스트로 대체 권장)
 * - 데이터 포맷팅/유효성 검증은 순수 함수 테스트로 충분
 * - 참고: docs/test-philosophy.md
 * ============================================
 *
 * 아래 Step들은 data-validation.feature와 함께 사용됩니다.
 * 필요 시 복원하여 사용할 수 있습니다.
 */

import { createBdd, type DataTable } from "playwright-bdd";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { RELATIVE_TIME_PATTERN } from "../../support/patterns";

const { Then } = createBdd(test);

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
