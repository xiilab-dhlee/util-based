import { createBdd } from "playwright-bdd";

import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
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
 * 3. 데이터 유효성 검증
 * 4. 등록 중인 이미지 데이터 유효성 검증
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

Then(
  "개인 레지스트리 구분 필터가 {string}로 표시된다",
  async ({ privateRegistryListPage }, expectedValue: string) => {
    await privateRegistryListPage.imageSourceTypeFilter.assertContainsText(
      expectedValue,
    );
  },
);

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

Then(
  "등록 중인 이미지 목록의 구분 필터가 {string}로 표시된다",
  async ({ privateRegistryListPage }, expectedValue: string) => {
    await privateRegistryListPage.jobListTypeFilter.assertContainsText(
      expectedValue,
    );
  },
);

// ============================================
// 3. 데이터 유효성 검증
// ============================================

Then(
  "각 개인 레지스트리의 이미지 이름이 빈 값이 아니다",
  async ({ privateRegistryListPage, assertLogger }) => {
    await privateRegistryListPage.table.forEachCell(
      REGISTRY_SELECTOR.IMAGE_NAME,
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
      REGISTRY_SELECTOR.IMAGE_TYPE,
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
      REGISTRY_SELECTOR.RECENT_TAG,
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
      REGISTRY_SELECTOR.TAG_COUNT,
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
      REGISTRY_SELECTOR.DOWNLOAD_COUNT,
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
      REGISTRY_SELECTOR.CREATED_AT,
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
// 4. 등록 중인 이미지 데이터 유효성 검증
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
        REGISTRY_SELECTOR.JOB_LIST_IMAGE_TYPE,
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
        REGISTRY_SELECTOR.JOB_LIST_STATUS,
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
        REGISTRY_SELECTOR.JOB_LIST_CREATED_AT,
      );
      assertLogger.assertMatch(
        `등록 중인 이미지[${index}] 생성일시`,
        text,
        DATETIME_PATTERN,
      );
    });
  },
);
