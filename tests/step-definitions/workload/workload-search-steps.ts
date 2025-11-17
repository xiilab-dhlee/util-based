import { After, Before, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { WorkloadPage } from "../../support/page-objects/workload-page";
import type { CustomWorld } from "../../support/world";

Before(async function (this: CustomWorld) {
  await this.initBrowser();
  await this.initMSW();
});

After(async function (this: CustomWorld) {
  await this.cleanup();
});

Given("워크로드 목록 페이지에 접근한다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await workloadPage.navigateToWorkloadList();
});

Given("워크로드 목록이 표시되어 있다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await workloadPage.waitForWorkloadList();
  await expect(workloadPage.workloadList).toBeVisible({ timeout: 10000 });
});

When(
  "사용자가 검색어 입력 필드에 {string}를 입력한다",
  async function (this: CustomWorld, searchText: string) {
    const workloadPage = new WorkloadPage(this.page);
    await workloadPage.enterSearchText(searchText);
  },
);

When("사용자가 검색어 입력 필드를 비운다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await workloadPage.clearSearchText();
});

When("사용자가 검색 버튼을 클릭한다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await workloadPage.clickSearchButton();
});

When(
  "사용자가 검색어 입력 필드에 빈 값을 입력한다",
  async function (this: CustomWorld) {
    const workloadPage = new WorkloadPage(this.page);
    await workloadPage.clearSearchText();
  },
);

Then("검색 결과가 표시된다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await expect(workloadPage.workloadList).toBeVisible({ timeout: 10000 });
});

Then(
  "검색 결과에 {string}가 포함된 워크로드만 표시된다",
  async function (this: CustomWorld, searchText: string) {
    const workloadPage = new WorkloadPage(this.page);
    const names = await workloadPage.getWorkloadNames();

    // 검색 결과가 있는 경우
    if (names.length > 0) {
      for (const name of names) {
        expect(name.toLowerCase()).toContain(searchText.toLowerCase());
      }
    }
  },
);

Then("전체 워크로드 목록이 표시된다", async function (this: CustomWorld) {
  const workloadPage = new WorkloadPage(this.page);
  await expect(workloadPage.workloadList).toBeVisible({ timeout: 10000 });

  // 검색어가 비어있는지 확인
  const searchInputValue = await workloadPage.searchInput.inputValue();
  expect(searchInputValue).toBe("");
});

Then(
  "{string} 메시지가 표시된다",
  async function (this: CustomWorld, message: string) {
    const workloadPage = new WorkloadPage(this.page);
    const emptyMessage = workloadPage.emptyResultMessage;
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });

    // 메시지 텍스트 확인
    const messageText = await emptyMessage.textContent();
    expect(messageText).toContain(message);
  },
);

Given(
  "사용자가 {string}로 검색한 상태이다",
  async function (this: CustomWorld, searchText: string) {
    const workloadPage = new WorkloadPage(this.page);
    await workloadPage.enterSearchText(searchText);
    await workloadPage.clickSearchButton();
    await this.page.waitForTimeout(500);
  },
);

When(
  "사용자가 작업 유형을 {string}로 선택한다",
  async function (this: CustomWorld, jobType: string) {
    const workloadPage = new WorkloadPage(this.page);
    await workloadPage.selectJobType(jobType);
  },
);

Then(
  "검색 결과의 모든 워크로드가 {string} 작업 유형이다",
  async function (this: CustomWorld, jobType: string) {
    const workloadPage = new WorkloadPage(this.page);
    const rows = workloadPage.workloadRows;
    const count = await rows.count();

    // 각 행의 작업 유형 확인 (실제 구현에 맞게 수정 필요)
    // 워크로드 테이블의 작업 유형 컬럼 인덱스를 확인해야 함
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      // 작업 유형이 표시되는 셀 찾기 (실제 구조에 맞게 수정 필요)
      const jobTypeCell = row.locator("td").nth(1); // 예시: 두 번째 컬럼
      const cellText = await jobTypeCell.textContent();
      expect(cellText?.toUpperCase()).toContain(jobType.toUpperCase());
    }
  },
);

Then(
  "검색 결과의 모든 워크로드 이름에 {string}가 포함되어 있다",
  async function (this: CustomWorld, searchText: string) {
    const workloadPage = new WorkloadPage(this.page);
    const names = await workloadPage.getWorkloadNames();

    for (const name of names) {
      expect(name.toLowerCase()).toContain(searchText.toLowerCase());
    }
  },
);

Then(
  "검색 결과 개수가 {string}개 이상이다",
  async function (this: CustomWorld, expectedCount: string) {
    const workloadPage = new WorkloadPage(this.page);
    const count = await workloadPage.getWorkloadCount();
    const expected = parseInt(expectedCount, 10);

    expect(count).toBeGreaterThanOrEqual(expected);
  },
);
