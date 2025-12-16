import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 워크로드 상세 페이지 Step Definitions
 *
 * Page Objects:
 * - workloadDetailPage: 워크로드 상세 페이지 (상세 정보 등)
 *
 * NOTE: 데이터 유효성 검증/UI 표시 검증 Step은
 *       tests/archives/steps/detail-validation.steps.ts로 이동됨
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 페이지 표시 확인 Steps
// ============================================

Then("워크로드 상세 페이지가 표시된다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.assertPageVisible();
});

Then("워크로드 로그 페이지가 표시된다", async ({ workloadLogPage }) => {
  await workloadLogPage.assertPageVisible();
});

// ============================================
// 상태별 검증 Steps
// ============================================

Given(
  "워크로드 상태가 {string}이다",
  async ({ workloadDetailPage, $testInfo }, status: string) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== status) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);

// ============================================
// 인터랙션 Steps - 버튼 클릭
// ============================================

When("워크로드 수정 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickEditButton();
});

When("워크로드 종료 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickStopButton();
});

When("워크로드 재시작 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickRestartButton();
});

When("워크로드 삭제 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickDeleteButton();
});

When("Commit Image 생성 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickCommitImageButton();
});

When("워크로드 복제 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickCloneButton();
});

// ============================================
// 인터랙션 Steps - 수정 모달
// ============================================

Then("수정 모달이 표시된다", async ({ modal }) => {
  await modal.waitForVisible();
});

Then("수정 모달에 이름 입력창이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.updateNameInput).toBeVisible();
});

Then("수정 모달에 설명 입력창이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.updateDescriptionInput).toBeVisible();
});

Then(
  "수정 모달의 이름 입력창에 현재 워크로드 이름이 입력되어 있다",
  async ({ workloadDetailPage, assertLogger }) => {
    const inputValue = await workloadDetailPage.getUpdateNameInputValue();
    // 이름이 비어있지 않으면 유효
    assertLogger.assertNotEmpty("수정 모달 이름 입력값", inputValue);
  },
);

Then(
  "수정 모달의 설명 입력창에 현재 워크로드 설명이 입력되어 있다",
  async ({ workloadDetailPage }) => {
    // 설명은 비어있을 수 있으므로 입력창이 visible한지만 확인
    await expect(workloadDetailPage.updateDescriptionInput).toBeVisible();
  },
);

// ============================================
// 인터랙션 Steps - Commit Image 모달
// ============================================

Then("Commit Image 생성 모달이 표시된다", async ({ modal }) => {
  await modal.waitForVisible();
});

Then(
  "Commit Image 이름 입력창이 빈 값으로 표시된다",
  async ({ workloadDetailPage }) => {
    await expect(workloadDetailPage.commitImageNameInput).toBeVisible();
    const value = await workloadDetailPage.commitImageNameInput.inputValue();
    expect(value).toBe("");
  },
);

Then(
  "Commit Image 태그 입력창이 빈 값으로 표시된다",
  async ({ workloadDetailPage }) => {
    await expect(workloadDetailPage.commitImageTagInput).toBeVisible();
    const value = await workloadDetailPage.commitImageTagInput.inputValue();
    expect(value).toBe("");
  },
);

// ============================================
// 인터랙션 Steps - 드로어
// ============================================

Then("워크로드 생성 드로어가 표시된다", async ({ drawer }) => {
  await drawer.waitForVisible();
});

// ============================================
// 워크로드 복제 검증 Steps
// ============================================

/**
 * Job Type 텍스트를 드로어 버튼 레이블로 변환
 *
 * 상세 페이지의 Job Type 텍스트를 드로어에서 선택된 버튼 레이블로 변환합니다.
 * DISTRIBUTED는 드로어에 별도 버튼이 없어 "Batch Job"으로 매핑됩니다.
 */
const JOB_TYPE_TO_LABEL: Record<string, string> = {
  "Batch Job": "Batch Job",
  "Distributed Job": "Batch Job", // 드로어에 별도 버튼 없음
  "Interactive Job (IDE)": "Interactive Job (IDE)",
};

Then(
  "선택된 Job Type 버튼이 상세 페이지의 Job Type과 동일하다",
  async ({ page, workloadDetailPage }) => {
    const detailJobType =
      (await workloadDetailPage.jobTypeName.textContent())?.trim() ?? "";
    const expectedLabel = JOB_TYPE_TO_LABEL[detailJobType] ?? detailJobType;

    const card = page.getByRole("button", { name: expectedLabel });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute("data-active", "true");
  },
);

Then(
  "워크로드 이름 입력창 내 텍스트가 상세 페이지의 워크로드 이름과 동일하다",
  async ({ page, workloadDetailPage, assertLogger }) => {
    const detailName =
      (await workloadDetailPage.name.textContent())?.trim() ?? "";

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 이름", inputValue, detailName);
  },
);

Then(
  "워크로드 설명 입력창 내 텍스트가 상세 페이지의 워크로드 설명과 동일하다",
  async ({ page, workloadDetailPage, assertLogger }) => {
    const rawDescription =
      (await workloadDetailPage.description.textContent())?.trim() ?? "";
    // "-"는 빈 값을 나타내므로 빈 문자열로 변환
    const detailDescription = rawDescription === "-" ? "" : rawDescription;

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_DESCRIPTION));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 설명", inputValue, detailDescription);
  },
);
