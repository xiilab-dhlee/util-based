import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import {
  ANT_SELECTOR,
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { DataTableComponent } from "../../components/data-table.component";
import { test } from "../../fixtures";
import { WorkloadListPage } from "../../pages/workload-list.page";

/**
 * 워크로드 생성 드로어 Step Definitions
 *
 * 구조:
 * 1. 버튼
 * 2. 입력창
 * 3. 워크로드 가져오기 모달
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 버튼
// ============================================

When("워크로드 생성하기 버튼을 클릭한다", async ({ page }) => {
  const button = page.locator(testId(WORKLOAD_SELECTOR.CREATE_BUTTON));
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
});

// ============================================
// 2. 입력창
// ============================================

Then("워크로드 이름 입력창이 빈 값으로 표시된다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toHaveValue("");
});

Then("워크로드 이름 입력창이 빈 값이 아니다", async ({ page }) => {
  const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
  await expect(input).toBeVisible({ timeout: 10000 });
  const value = await input.inputValue();
  expect(value.length).toBeGreaterThan(0);
});

Then("잡 타입이 선택되어 있다", async ({ page }) => {
  // data-active="true"인 JobTypeCard 버튼이 존재하는지 확인
  const activeJobType = page.locator('[data-active="true"]');
  await expect(activeJobType).toBeVisible({ timeout: 10000 });
});

// ============================================
// 3. 워크로드 가져오기 모달
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

Then("모달에 워크로드 목록 테이블이 표시된다", async ({ page }) => {
  const modal = page.locator(ANT_SELECTOR.MODAL);
  const table = modal.locator(".ant-table-tbody");
  await expect(table).toBeVisible({ timeout: 10000 });
});

Given("모달 목록에 워크로드가 있다", async ({ page }) => {
  const modal = page.locator(ANT_SELECTOR.MODAL);
  const rows = modal.locator(".ant-table-tbody tr.ant-table-row");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
});

When(
  "첫 번째 워크로드의 라디오버튼을 클릭한다",
  async ({ page, radio, workloadContext }) => {
    const modal = page.locator(ANT_SELECTOR.MODAL);

    // 모달 내 테이블에서 DataTableComponent 사용
    const table = new DataTableComponent(modal, WORKLOAD_SELECTOR.NAME);

    // 워크로드 정보 저장 (이름, 잡타입)
    const workloadName = await table.getFirstCellText(WORKLOAD_SELECTOR.NAME);
    const jobType = await table.getFirstCellText(WORKLOAD_SELECTOR.JOB_TYPE);

    workloadContext.set({
      name: workloadName,
      jobType: jobType.trim().toLowerCase(),
    });

    // 라디오버튼 클릭
    const firstRow = await table.getFirstRow();
    await radio.selectInRow(firstRow);
  },
);
