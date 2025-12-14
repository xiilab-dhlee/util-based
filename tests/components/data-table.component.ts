import type { Locator, Page } from "@playwright/test";

import { testId, testIdPrefix } from "@/shared/constants/selector.constant";

/**
 * 데이터 테이블 Component Object (험블 객체)
 *
 * Playwright 의존성을 격리하여 Step Definition의 복잡도를 낮춤
 * - 테이블 행 반복 처리 추상화
 * - 행 선택 및 버튼 클릭 캡슐화
 * - 상태별 행 찾기 기능
 *
 * @example
 * // 페이지 전체에서 테이블 조작
 * const table = new DataTableComponent(page, WORKLOAD_SELECTOR.NAME);
 * const count = await table.getRowCount();
 *
 * @example
 * // 모달 내 테이블 조작
 * const modal = page.locator('.ant-modal:visible');
 * const table = new DataTableComponent(modal, WORKLOAD_SELECTOR.NAME);
 */
export class DataTableComponent {
  private container: Page | Locator;

  constructor(
    pageOrContainer: Page | Locator,
    private columnTestId: string,
  ) {
    this.container = pageOrContainer;
  }

  /**
   * Page 객체 반환 (waitForLoadState 등에 사용)
   */
  private get page(): Page {
    return "page" in this.container
      ? (this.container as Locator).page()
      : (this.container as Page);
  }

  /**
   * 테이블 컬럼 요소들의 Locator
   */
  private get columns(): Locator {
    return this.container.locator(testId(this.columnTestId));
  }

  /**
   * 테이블 행 개수 반환
   */
  async getRowCount(): Promise<number> {
    return await this.columns.count();
  }

  /**
   * 특정 인덱스의 행에서 지정된 컬럼의 텍스트 반환
   *
   * @param rowIndex - 행 인덱스 (0-based)
   * @param columnTestId - 컬럼의 data-testid
   */
  async getCellText(rowIndex: number, columnTestId: string): Promise<string> {
    const row = await this.getRow(rowIndex);
    const cell = row.locator(testId(columnTestId));
    return ((await cell.textContent()) ?? "").trim();
  }

  /**
   * 특정 인덱스의 행 Locator 반환
   * xpath=ancestor::tr 패턴을 캡슐화
   *
   * @param rowIndex - 행 인덱스 (0-based)
   */
  async getRow(rowIndex: number): Promise<Locator> {
    return this.columns.nth(rowIndex).locator("xpath=ancestor::tr");
  }

  /**
   * 첫 번째 행 Locator 반환
   */
  async getFirstRow(): Promise<Locator> {
    return this.getRow(0);
  }

  /**
   * 특정 상태의 행 찾기
   * testIdPrefix를 사용한 동적 상태 검색
   *
   * @param statusTestIdPrefix - 상태 testId prefix (예: "workload-status-")
   * @param statusValue - 찾을 상태 값 (예: "running")
   * @returns 해당 상태의 첫 번째 행 Locator, 없으면 null
   */
  async findRowByStatus(
    statusTestIdPrefix: string,
    statusValue: string,
  ): Promise<Locator | null> {
    const statusSelector = testId(`${statusTestIdPrefix}${statusValue}`);
    const statusCell = this.container.locator(statusSelector).first();

    const count = await statusCell.count();
    if (count === 0) {
      return null;
    }

    return statusCell.locator("xpath=ancestor::tr");
  }

  /**
   * 행 내의 버튼 클릭
   *
   * @param row - 대상 행 Locator
   * @param buttonTestId - 버튼의 data-testid
   */
  async clickRowButton(row: Locator, buttonTestId: string): Promise<void> {
    const button = row.locator(testId(buttonTestId));
    await button.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 모든 행에 대해 콜백 함수 실행 (nth 패턴 추상화)
   *
   * @param columnTestId - 값을 가져올 컬럼의 data-testid
   * @param callback - 각 행에서 실행할 콜백 (text, index)
   * @returns 콜백 결과 배열
   *
   * @example
   * await table.forEachCell(WORKLOAD_SELECTOR.NAME, (text, i) => {
   *   assertLogger.assertNotEmpty(`워크로드[${i}] 이름`, text);
   * });
   */
  async forEachCell<T>(
    columnTestId: string,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const cells = this.container.locator(testId(columnTestId));
    const count = await cells.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const text = ((await cells.nth(i).textContent()) ?? "").trim();
      results.push(callback(text, i));
    }

    return results;
  }

  /**
   * 동적 testId prefix로 모든 행 순회
   * workload-status-running, workload-status-pending 등 동적 ID 처리
   *
   * @param testIdPrefixStr - testId prefix (예: "workload-status-")
   * @param callback - 각 요소에서 실행할 콜백 (extractedValue, index)
   */
  async forEachByPrefix<T>(
    testIdPrefixStr: string,
    callback: (extractedValue: string, index: number) => T,
  ): Promise<T[]> {
    const elements = this.container.locator(testIdPrefix(testIdPrefixStr));
    const count = await elements.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const testIdValue = await elements.nth(i).getAttribute("data-testid");
      const extractedValue = testIdValue?.replace(testIdPrefixStr, "") ?? "";
      results.push(callback(extractedValue, i));
    }

    return results;
  }

  /**
   * 첫 번째 행의 특정 컬럼 텍스트 반환
   *
   * @param columnTestId - 컬럼의 data-testid
   */
  async getFirstCellText(columnTestId: string): Promise<string> {
    const cell = this.container.locator(testId(columnTestId)).first();
    return ((await cell.textContent()) ?? "").trim();
  }

  /**
   * 첫 번째 행의 특정 컬럼 클릭
   *
   * @param columnTestId - 컬럼의 data-testid
   */
  async clickFirstCell(columnTestId: string): Promise<void> {
    const cell = this.container.locator(testId(columnTestId)).first();
    await cell.click();
    await this.page.waitForLoadState("networkidle");
  }
}
