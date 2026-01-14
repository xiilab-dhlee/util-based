import { createBdd } from "playwright-bdd";

import {
  PRIVATE_REGISTRY_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import {
  createUnitPattern,
  DATE_PATTERN,
  DATETIME_PATTERN,
} from "../../support/patterns";

/**
 * 개인 레지스트리 목록 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 페이지 표시 검증
 * 3. 검색 결과 검증
 * 4. 정렬 기능
 * 5. 등록 중인 이미지 목록 검증
 * 6. 체크박스 및 삭제 기능
 * 7. 데이터 유효성 검증
 * 8. 등록 중인 이미지 데이터 유효성 검증
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given(
  "개인 레지스트리 목록 페이지에 있다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.goto();
  },
);

When(
  "개인 레지스트리 목록 페이지로 이동한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.goto();
  },
);

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then(
  "개인 레지스트리 목록 페이지가 표시된다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.assertPageVisible();
  },
);

// ============================================
// 3. 검색 결과 검증
// ============================================

Then(
  "개인 레지스트리 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({
    privateRegistryListPage,
    listSearchInput,
    assertLogger,
    $testInfo,
  }) => {
    // 테이블이 표시될 때까지 대기
    await privateRegistryListPage.table.assertTableVisible(SELECTOR.LIST_TABLE);

    // 검색 결과 검증
    await privateRegistryListPage.table.validateSearch(
      await listSearchInput.getValue(),
      PRIVATE_REGISTRY_SELECTOR.IMAGE_NAME,
      assertLogger,
      $testInfo,
      "개인 레지스트리",
    );
  },
);

// ============================================
// 4. 정렬 기능
// ============================================

/** 한글 정렬 기준 → 셀 selector 매핑 */
const SORT_CELL_MAP: Record<string, string> = {
  생성일: PRIVATE_REGISTRY_SELECTOR.CREATED_AT,
};

When(
  "개인 레지스트리 목록을 {string} 기준 {string}으로 정렬한다",
  async (
    { privateRegistryListPage },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    await privateRegistryListPage.table.sortByColumn(field, order);
  },
);

Then(
  "개인 레지스트리 목록이 {string} 기준 {string}으로 정렬되어 표시된다",
  async (
    { privateRegistryListPage, assertLogger },
    field: string,
    order: "오름차순" | "내림차순",
  ) => {
    const cellSelector = SORT_CELL_MAP[field];
    if (!cellSelector) {
      throw new Error(`알 수 없는 정렬 필드: ${field}`);
    }

    // 로딩 완료 대기
    await privateRegistryListPage.table.waitForLoaded();

    // 실제 데이터 정렬 순서 검증
    const compareType = field === "생성일" ? "date" : "string";
    await privateRegistryListPage.table.assertDataSortOrder(
      cellSelector,
      order,
      assertLogger,
      compareType,
    );
  },
);

// ============================================
// 5. 등록 중인 이미지 목록 검증
// ============================================

Then(
  "등록 중인 이미지 목록의 총 개수가 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.assertJobListTotalCountVisible(assertLogger);
  },
);

Then(
  "등록 중인 이미지 목록의 검색창이 빈 값으로 표시된다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.assertJobListSearchInputEmpty();
  },
);

Then(
  "등록 중인 이미지 목록의 페이지네이션이 표시된다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.assertJobListPaginationVisible();
  },
);

When(
  "등록 중인 이미지 목록의 검색창에 {string}를 입력한다",
  async ({ privateRegistryListPage }, keyword: string) => {
    await privateRegistryListPage.jobListSearchInput.search(keyword);
  },
);

Then(
  "등록 중인 이미지 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ privateRegistryListPage, assertLogger, $testInfo }) => {
    // 카드가 표시될 때까지 대기
    await privateRegistryListPage.jobListGrid.assertCardsVisible();

    // 검색 결과 검증
    await privateRegistryListPage.jobListGrid.validateSearch(
      await privateRegistryListPage.jobListSearchInput.getValue(),
      assertLogger,
      $testInfo,
      "등록 중인 이미지",
    );
  },
);

// ============================================
// 6. 체크박스 및 삭제 기능
// ============================================

When(
  "첫 번째 개인 레지스트리의 체크박스를 클릭한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.table.clickRowCheckbox(0);
  },
);

// ============================================
// 7. 데이터 유효성 검증
// ============================================

Then(
  "각 개인 레지스트리의 이미지 이름이 빈 값이 아니다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.IMAGE_NAME,
      (text, i) => {
        assertLogger.assertNotEmpty(`개인 레지스트리[${i}] 이미지 이름`, text);
      },
    );
  },
);

Then(
  "각 개인 레지스트리의 구분이 빈 값이 아니다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.IMAGE_TYPE,
      (text, i) => {
        assertLogger.assertNotEmpty(`개인 레지스트리[${i}] 구분`, text);
      },
    );
  },
);

Then(
  "각 개인 레지스트리의 최근 태그가 빈 값이 아니다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.RECENT_TAG,
      (text, i) => {
        assertLogger.assertNotEmpty(`개인 레지스트리[${i}] 최근 태그`, text);
      },
    );
  },
);

Then(
  "각 개인 레지스트리의 태그 개수가 올바른 형식으로 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.TAG_COUNT,
      (text, i) => {
        assertLogger.assertMatch(
          `개인 레지스트리[${i}] 태그 개수`,
          text,
          createUnitPattern("개"),
        );
      },
    );
  },
);

Then(
  "각 개인 레지스트리의 다운로드 횟수가 올바른 형식으로 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.DOWNLOAD_COUNT,
      (text, i) => {
        assertLogger.assertMatch(
          `개인 레지스트리[${i}] 다운로드 횟수`,
          text,
          createUnitPattern("번"),
        );
      },
    );
  },
);

Then(
  "각 개인 레지스트리의 생성일이 올바른 형식으로 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      PRIVATE_REGISTRY_SELECTOR.CREATED_AT,
      (text, i) => {
        assertLogger.assertMatch(
          `개인 레지스트리[${i}] 생성일`,
          text,
          DATE_PATTERN,
        );
      },
    );
  },
);

// ============================================
// 8. 등록 중인 이미지 데이터 유효성 검증
// ============================================

Then(
  "각 등록 중인 이미지의 이름이 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.jobListGrid.forEachCard(async (index) => {
      const title =
        await privateRegistryListPage.jobListGrid.getCardTitle(index);
      assertLogger.assertNotEmpty(`등록 중인 이미지[${index}] 이름`, title);
    });
  },
);

Then(
  "각 등록 중인 이미지의 구분이 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.jobListGrid.forEachCard(async (index) => {
      const text = await privateRegistryListPage.jobListGrid.getCardElementText(
        index,
        PRIVATE_REGISTRY_SELECTOR.JOB_LIST_IMAGE_TYPE,
      );
      assertLogger.assertNotEmpty(`등록 중인 이미지[${index}] 구분`, text);
    });
  },
);

Then(
  "각 등록 중인 이미지의 상태가 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.jobListGrid.forEachCard(async (index) => {
      const text = await privateRegistryListPage.jobListGrid.getCardElementText(
        index,
        PRIVATE_REGISTRY_SELECTOR.JOB_LIST_STATUS,
      );
      assertLogger.assertNotEmpty(`등록 중인 이미지[${index}] 상태`, text);
    });
  },
);

Then(
  "각 등록 중인 이미지의 생성일시가 yyyy.MM.dd HH:mm:ss 형식으로 표시된다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.jobListGrid.forEachCard(async (index) => {
      const text = await privateRegistryListPage.jobListGrid.getCardElementText(
        index,
        PRIVATE_REGISTRY_SELECTOR.JOB_LIST_CREATED_AT,
      );
      assertLogger.assertMatch(
        `등록 중인 이미지[${index}] 생성일시`,
        text,
        DATETIME_PATTERN,
      );
    });
  },
);
