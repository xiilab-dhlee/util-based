import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  SELECTOR,
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { DataTableComponent } from "../../components/data-table.component";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";

/**
 * 워크로드 생성 드로어 Step Definitions
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 버튼 관련
// ============================================

When("워크로드 생성하기 버튼을 클릭한다", async ({ page }) => {
  const button = page.locator(testId(WORKLOAD_SELECTOR.CREATE_BUTTON));
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
});

Then(
  /^"(최근 워크로드 가져오기|워크로드 목록에서 가져오기)" 버튼이 표시된다$/,
  async ({ page }, buttonText: string) => {
    const selector = WorkloadListPage.CREATE_BUTTON[buttonText];
    await expect(page.locator(testId(selector))).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  /^"(Batch Job|Interactive Job)" 버튼이 선택되어 있다$/,
  async ({ page }, buttonText: string) => {
    const labelMap: Record<string, string> = {
      "Batch Job": "Batch Job",
      "Interactive Job": "Interactive Job (IDE)",
    };
    const label = labelMap[buttonText];

    // JobTypeCard의 data-active 속성으로 선택 상태 확인
    const card = page.getByRole("button", { name: label });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute("data-active", "true");
  },
);

// ============================================
// 입력창 관련
// ============================================

Then("워크로드 이름 입력창이 빈 값으로 표시된다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toHaveValue("");
});

Then("워크로드 설명 입력창이 빈 값으로 표시된다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_DESCRIPTION));
  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toHaveValue("");
});

// ============================================
// 워크로드 가져오기 모달
// ============================================

When(
  /^"(최근 워크로드 가져오기|워크로드 목록에서 가져오기)" 버튼을 클릭한다$/,
  async ({ page }, buttonText: string) => {
    const selector = WorkloadListPage.CREATE_BUTTON[buttonText];
    const button = page.locator(testId(selector));
    await expect(button).toBeVisible({ timeout: 10000 });
    await button.click();
  },
);

Then("{string} 모달이 표시된다", async ({ page }, modalTitle: string) => {
  const modal = page.locator(SELECTOR.MODAL);
  await expect(modal).toBeVisible({ timeout: 10000 });

  const title = modal.locator(".ant-modal-title");
  await expect(title).toHaveText(modalTitle);
});

Then("모달에 워크로드 목록 테이블이 표시된다", async ({ page }) => {
  const modal = page.locator(SELECTOR.MODAL);
  const table = modal.locator(".ant-table-tbody");
  await expect(table).toBeVisible({ timeout: 10000 });
});

Given("모달 목록에 워크로드가 있다", async ({ page }) => {
  const modal = page.locator(SELECTOR.MODAL);
  const rows = modal.locator(".ant-table-tbody tr.ant-table-row");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
});

When(
  "첫 번째 워크로드의 라디오버튼을 클릭한다",
  async ({ page, radio, workloadContext }) => {
    const modal = page.locator(SELECTOR.MODAL);

    // 모달 내 테이블에서 DataTableComponent 사용
    const table = new DataTableComponent(modal, WORKLOAD_SELECTOR.NAME);

    // 워크로드 정보 저장 (이름, 잡타입)
    const workloadName = await table.getFirstCellText(WORKLOAD_SELECTOR.NAME);
    const jobType = await table.getFirstCellText(WORKLOAD_SELECTOR.JOB_TYPE);

    workloadContext.set({
      name: workloadName,
      jobType: jobType.toLowerCase(),
    });

    // 라디오버튼 클릭
    const firstRow = await table.getFirstRow();
    await radio.selectInRow(firstRow);
  },
);

When(
  "모달의 {string} 버튼을 클릭한다",
  async ({ page }, buttonText: string) => {
    const modal = page.locator(SELECTOR.MODAL);
    const button = modal.getByRole("button", { name: buttonText });
    await expect(button).toBeEnabled({ timeout: 10000 });
    await button.click();
  },
);

Then("모달이 닫힌다", async ({ page }) => {
  const modal = page.locator(SELECTOR.MODAL);
  await expect(modal).not.toBeVisible({ timeout: 10000 });
});

// ============================================
// 워크로드 정보 검증 (공통)
// ============================================

Then(
  "워크로드 이름 입력창에 저장된 워크로드 이름이 표시된다",
  async ({ page, workloadContext, assertLogger }) => {
    const { name } = workloadContext.get();

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 이름 입력값", inputValue, name);
  },
);

Then(
  "워크로드 설명 입력창에 저장된 워크로드 설명이 표시된다",
  async ({ page, workloadContext, assertLogger }) => {
    const { description } = workloadContext.get();

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_DESCRIPTION));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 설명 입력값", inputValue, description);
  },
);

Then(
  "잡 타입이 저장된 워크로드와 동일하다",
  async ({ page, workloadContext, assertLogger }) => {
    const { jobType } = workloadContext.get();

    // 잡 타입에 따른 버튼 레이블 매핑 (UI 표시값: batch, distributed, interactive)
    const jobTypeToLabel: Record<string, string> = {
      batch: "Batch Job",
      distributed: "Batch Job",
      interactive: "Interactive Job (IDE)",
    };
    const expectedLabel = jobTypeToLabel[jobType] ?? jobType;

    const card = page.getByRole("button", { name: expectedLabel });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute("data-active", "true");

    assertLogger.assertEqual("잡 타입 버튼", expectedLabel, expectedLabel);
  },
);
