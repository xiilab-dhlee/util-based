import { createBdd, type DataTable } from "playwright-bdd";

import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/** 필터 조건 타입 */
interface PrivateRegistryFilterCondition {
  imageSourceType: string;
}

/**
 * 개인 레지스트리 필터링 Step Definitions
 *
 * 구조:
 * 1. 개인 레지스트리 필터링
 * 2. 등록 중인 이미지 필터링
 */
const { When, Then } = createBdd(test);

// ============================================
// 1. 개인 레지스트리 필터링
// ============================================

/**
 * 필터 조건 설정
 * - imageSourceType: UI에 표시되는 값 ("Snapshot", "External" 등)
 */
When(
  "개인 레지스트리 필터를 설정한다:",
  async ({ privateRegistryListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 구분 필터 설정 (Feature에서 UI 텍스트 직접 사용)
    await privateRegistryListPage.imageSourceTypeFilter.select(imageSourceType);
  },
);

/** 필터 UI 상태 검증 (선택된 필터 값 표시 확인) */
Then(
  "개인 레지스트리 필터가 설정된 조건을 표시한다:",
  async ({ privateRegistryListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 구분 필터 UI 검증
    await privateRegistryListPage.imageSourceTypeFilter.assertContainsText(
      imageSourceType,
    );
  },
);

/**
 * 필터링된 목록 결과 검증
 * - 목록의 모든 개인 레지스트리가 필터 조건에 맞는지 확인
 * - imageSourceType: 각 행의 값이 필터 조건과 일치하는지 확인
 */
Then(
  "필터링된 개인 레지스트리 목록이 조건에 맞게 표시된다:",
  async ({ privateRegistryListPage, assertLogger }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 로딩 완료 대기
    await privateRegistryListPage.table.waitForLoaded();

    const rowCount = await privateRegistryListPage.table.getRowCount();

    // 목록이 비어있으면 검증 스킵 (데이터가 없는 경우도 필터링 성공)
    if (rowCount === 0) {
      return;
    }

    // 구분 검증 (대소문자 무시 비교)
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.IMAGE_TYPE,
      (text, i) => {
        assertLogger.assertEqual(
          `개인 레지스트리[${i}] 구분`,
          text.toLowerCase(),
          imageSourceType.toLowerCase(),
        );
      },
    );
  },
);

// ============================================
// 2. 등록 중인 이미지 필터링
// ============================================

/**
 * 필터 조건 설정
 * - imageSourceType: UI에 표시되는 값 ("Snapshot", "External" 등)
 */
When(
  "등록 중인 이미지 필터를 설정한다:",
  async ({ privateRegistryListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 구분 필터 설정 (Feature에서 UI 텍스트 직접 사용)
    await privateRegistryListPage.jobListTypeFilter.select(imageSourceType);
  },
);

/** 필터 UI 상태 검증 (선택된 필터 값 표시 확인) */
Then(
  "등록 중인 이미지 필터가 설정된 조건을 표시한다:",
  async ({ privateRegistryListPage }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 구분 필터 UI 검증
    await privateRegistryListPage.jobListTypeFilter.assertContainsText(
      imageSourceType,
    );
  },
);

/**
 * 필터링된 목록 결과 검증
 * - 목록의 모든 등록 중인 이미지가 필터 조건에 맞는지 확인
 * - imageSourceType: 각 카드의 값이 필터 조건과 일치하는지 확인
 */
Then(
  "필터링된 등록 중인 이미지 목록이 조건에 맞게 표시된다:",
  async ({ privateRegistryListPage, assertLogger }, dataTable: DataTable) => {
    const rows = dataTable.hashes();
    if (rows.length === 0) {
      throw new Error(
        "필터 조건 DataTable이 비어있습니다. 최소 1개의 행이 필요합니다.",
      );
    }

    const { imageSourceType } =
      rows[0] as unknown as PrivateRegistryFilterCondition;

    // 카드가 표시될 때까지 대기
    await privateRegistryListPage.jobListGrid.assertCardsVisible();

    const cardCount = await privateRegistryListPage.jobListGrid.getCardCount();

    // 목록이 비어있으면 검증 스킵 (데이터가 없는 경우도 필터링 성공)
    if (cardCount === 0) {
      return;
    }

    // 구분 검증 (대소문자 무시 비교)
    await privateRegistryListPage.jobListGrid.forEachCard(async (index) => {
      const text = await privateRegistryListPage.jobListGrid.getCardElementText(
        index,
        PRIVATE_REGISTRY_SELECTOR.JOB_LIST_IMAGE_TYPE,
      );
      assertLogger.assertEqual(
        `등록 중인 이미지[${index}] 구분`,
        text.toLowerCase(),
        imageSourceType.toLowerCase(),
      );
    });
  },
);
