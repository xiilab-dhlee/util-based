import type { Locator, Page } from "@playwright/test";

export class WorkloadPage {
  constructor(private page: Page) {}

  // 워크로드 목록 검색 폼
  get listSearchForm(): Locator {
    return this.page.locator("[data-testid='workload-list-search-form']");
  }
  // 워크로드 목록 검색 입력 필드
  get searchInput(): Locator {
    return this.listSearchForm.locator("input").first();
  }
  // 워크로드 목록 검색 버튼
  get searchButton(): Locator {
    return this.listSearchForm.locator("button").first();
  }

  get workloadList(): Locator {
    return this.page.locator('.ant-table, [role="table"], table').first();
  }

  get workloadRows(): Locator {
    return this.workloadList.locator('tbody tr, [role="row"]');
  }

  get emptyResultMessage(): Locator {
    return this.page
      .locator("text=검색 결과가 없습니다, text=결과가 없습니다, .ant-empty")
      .first();
  }

  get totalCount(): Locator {
    return this.page
      .locator("text=워크로드 목록")
      .locator("..")
      .locator("text=/\\d+/")
      .first();
  }

  get jobTypeFilter(): Locator {
    return this.page
      .locator("text=작업 유형, text=Job Type")
      .locator("..")
      .locator("select, .ant-select")
      .first();
  }

  get statusFilter(): Locator {
    return this.page
      .locator("text=상태, text=Status")
      .locator("..")
      .locator("select, .ant-select")
      .first();
  }

  async navigateToWorkloadList() {
    await this.page.goto("/standard/workload");
    await this.page.waitForLoadState("networkidle");
  }

  async enterSearchText(searchText: string) {
    await this.searchInput.fill(searchText);
    await this.page.waitForTimeout(300);
  }

  async clearSearchText() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(300);
  }

  async clickSearchButton() {
    await this.searchButton.click();
    await this.page.waitForTimeout(500); // 검색 결과 로딩 대기
  }

  async submitSearch() {
    // Enter 키로 검색 제출
    await this.searchInput.press("Enter");
    await this.page.waitForTimeout(500);
  }

  async getWorkloadNames(): Promise<string[]> {
    // 워크로드 이름이 있는 셀 찾기 (첫 번째 컬럼 또는 워크로드 이름 컬럼)
    const nameCells = this.workloadRows.locator("td").first();
    const count = await nameCells.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await nameCells.nth(i).textContent();
      if (text) names.push(text.trim());
    }

    return names;
  }

  async getWorkloadCount(): Promise<number> {
    const rows = this.workloadRows;
    return await rows.count();
  }

  async selectJobType(jobType: string) {
    await this.jobTypeFilter.click();
    await this.page.waitForTimeout(300);
    await this.page.locator(`text=${jobType}`).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectStatus(status: string) {
    await this.statusFilter.click();
    await this.page.waitForTimeout(300);
    await this.page.locator(`text=${status}`).first().click();
    await this.page.waitForTimeout(300);
  }

  async waitForWorkloadList() {
    await this.workloadList.waitFor({ state: "visible", timeout: 10000 });
  }
}
