import { createBdd, type DataTable } from "playwright-bdd";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import type { FilterCondition } from "../../support/types";

/**
 * 워크로드 필터 Step Definitions
 *
 * 필터링 관련 Step 정의:
 * 1. 필터 초기 상태 검증
 * 2. 필터 설정
 * 3. 필터 UI 상태 검증
 * 4. 필터링 결과 검증
 */
const { When, Then } = createBdd(test);

// ============================================
// 1. 필터 초기 상태 검증
// ============================================

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

// ============================================
// 2. 필터 설정
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

// ============================================
// 3. 필터 UI 상태 검증
// ============================================

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

// ============================================
// 4. 필터링 결과 검증
// ============================================

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
      await workloadListPage.table.forEachByPrefix(
        "workload-status-",
        (statusValue, i) => {
          assertLogger.assertEqual(`워크로드[${i}] 상태`, statusValue, status);
        },
      );
    }
  },
);
