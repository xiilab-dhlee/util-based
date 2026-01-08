import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

import {
  SELECTOR,
  testId,
  testIdPrefix,
} from "@/shared/constants/selector.constant";
import type { AssertLogger } from "../fixtures";

// 타입 정의
type SortState = "asc" | "desc" | "none";
type SortOrder = "오름차순" | "내림차순";
type CompareType = "string" | "date";

/** 한국어 날짜 형식(yyyy.MM.dd) 파싱 */
const parseKoreanDate = (dateStr: string): number => {
  const timestamp = new Date(dateStr.replace(/\./g, "-")).getTime();
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid date format: "${dateStr}". Expected yyyy.MM.dd`);
  }

  return timestamp;
};

/**
 * 데이터 테이블 험블 객체
 *
 * - columnTestId: 행 순회용 셀 data-testid (각 행에 반복)
 * - tableTestId: 테이블 컨테이너 data-testid (페이지당 하나)
 */
export class DataTableComponent {
  private container: Page | Locator;

  constructor(
    pageOrContainer: Page | Locator,
    private columnTestId: string,
  ) {
    this.container = pageOrContainer;
  }

  private isLocator(obj: Page | Locator): obj is Locator {
    return "page" in obj && typeof obj.page === "function";
  }

  private get page(): Page {
    return this.isLocator(this.container)
      ? this.container.page()
      : this.container;
  }

  private async getTextContent(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? "").trim();
  }

  private get columns(): Locator {
    return this.container.locator(testId(this.columnTestId));
  }

  // ============================================
  // 행 조회
  // ============================================

  async getRowCount(): Promise<number> {
    return await this.columns.count();
  }

  async getCellText(rowIndex: number, columnTestId: string): Promise<string> {
    const row = await this.getRow(rowIndex);
    const cell = row.locator(testId(columnTestId));
    return this.getTextContent(cell);
  }

  async getRow(rowIndex: number): Promise<Locator> {
    return this.columns.nth(rowIndex).locator("xpath=ancestor::tr");
  }

  async getFirstRow(): Promise<Locator> {
    return this.getRow(0);
  }

  async findRowByStatus(
    statusTestIdPrefix: string,
    statusValue: string,
  ): Promise<Locator | null> {
    const statusSelector = testId(`${statusTestIdPrefix}${statusValue}`);
    const statusCell = this.container.locator(statusSelector).first();

    if ((await statusCell.count()) === 0) {
      return null;
    }

    return statusCell.locator("xpath=ancestor::tr");
  }

  // ============================================
  // 행 조작
  // ============================================

  async clickRowButton(row: Locator, buttonTestId: string): Promise<void> {
    const button = row.locator(testId(buttonTestId));
    await button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async forEachCell<T>(
    columnTestId: string,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const cells = this.container.locator(testId(columnTestId));
    const count = await cells.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.getTextContent(cells.nth(i));
      results.push(callback(text, i));
    }

    return results;
  }

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

  async getFirstCellText(columnTestId: string): Promise<string> {
    const cell = this.container.locator(testId(columnTestId)).first();
    return this.getTextContent(cell);
  }

  async clickFirstCell(columnTestId: string): Promise<void> {
    const cell = this.container.locator(testId(columnTestId)).first();
    await cell.click();
    await this.page.waitForLoadState("networkidle");
  }

  async waitForLoaded(timeout = 10000): Promise<void> {
    const spinner = this.container.locator(SELECTOR.ANT_SPINNER);
    await expect(spinner).toBeHidden({ timeout });
  }

  // ============================================
  // 테이블 상태 검증
  // ============================================

  async assertTableVisible(
    tableTestId: string,
    timeout = 10000,
  ): Promise<void> {
    const table = this.container.locator(testId(tableTestId));
    await expect(table).toBeVisible({ timeout });
    await this.waitForLoaded(timeout);
  }

  async assertEmptyMessage(
    tableTestId: string,
    expectedMessage: string,
    timeout = 10000,
  ): Promise<void> {
    const table = this.container.locator(testId(tableTestId));
    const emptyPlaceholder = table.locator(SELECTOR.ANT_EMPTY_PLACEHOLDER);
    await expect(emptyPlaceholder).toBeVisible({ timeout });
    await expect(emptyPlaceholder).toContainText(expectedMessage);
  }

  async validateSearch(
    searchText: string,
    cellSelector: string,
    assertLogger: AssertLogger,
    testInfo: TestInfo,
    resultType = "결과",
  ): Promise<void> {
    const rowCount = await this.getRowCount();

    if (rowCount === 0) {
      testInfo.skip(
        true,
        `"${searchText}" 검색 결과가 없어 검증을 스킵합니다.`,
      );
    }

    const checkCount = Math.min(rowCount, 3);
    for (let i = 0; i < checkCount; i++) {
      const text = await this.getCellText(i, cellSelector);
      const containsSearch = text
        .toLowerCase()
        .includes(searchText.toLowerCase());
      assertLogger.assertTrue(
        `${resultType}[${i}] "${text}"이(가) "${searchText}" 포함`,
        containsSearch,
      );
    }
  }

  // ============================================
  // 정렬 기능
  // ============================================

  /** Ant Design Table 중복 헤더 처리 (thead th만 선택) */
  private getColumnHeader(columnTitle: string): Locator {
    return this.container
      .locator(SELECTOR.ANT_COLUMN_HEADER)
      .filter({ hasText: columnTitle })
      .first();
  }

  private async getCurrentSortState(columnHeader: Locator): Promise<SortState> {
    const upArrow = columnHeader.locator(SELECTOR.SORT_ARROW_UP).first();
    const downArrow = columnHeader.locator(SELECTOR.SORT_ARROW_DOWN).first();

    const isUpActive = await upArrow
      .evaluate((el) => el.classList.contains("active"))
      .catch(() => false);
    const isDownActive = await downArrow
      .evaluate((el) => el.classList.contains("active"))
      .catch(() => false);

    if (isUpActive) return "asc";
    if (isDownActive) return "desc";
    return "none";
  }

  private toSortState(order: SortOrder): SortState {
    return order === "오름차순" ? "asc" : "desc";
  }

  async sortByColumn(columnTitle: string, order: SortOrder): Promise<void> {
    await this.waitForLoaded();

    const columnHeader = this.getColumnHeader(columnTitle);
    const targetState = this.toSortState(order);
    let currentState = await this.getCurrentSortState(columnHeader);

    if (currentState === targetState) {
      return;
    }

    // 정렬 순환: none → asc → desc → none (최대 3번 클릭)
    for (let i = 0; i < 3; i++) {
      await columnHeader.click({ force: true });
      await this.page.waitForLoadState("networkidle");
      await this.waitForLoaded();

      currentState = await this.getCurrentSortState(columnHeader);
      if (currentState === targetState) {
        return;
      }
    }
  }

  async assertSortOrder(columnTitle: string, order: SortOrder): Promise<void> {
    const columnHeader = this.getColumnHeader(columnTitle);

    const expectedArrowSelector =
      order === "오름차순" ? SELECTOR.SORT_ARROW_UP : SELECTOR.SORT_ARROW_DOWN;

    const activeArrow = columnHeader
      .locator(`${expectedArrowSelector}${SELECTOR.SORT_ACTIVE}`)
      .first();
    await expect(activeArrow).toBeVisible();
  }

  async assertDataSortOrder(
    cellSelector: string,
    order: SortOrder,
    assertLogger: AssertLogger,
    compareType: CompareType = "string",
  ): Promise<void> {
    const cells = this.container.locator(testId(cellSelector));
    const count = await cells.count();

    if (count < 2) {
      return;
    }

    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      values.push(await this.getTextContent(cells.nth(i)));
    }

    const isAscending = order === "오름차순";
    const compareSymbol = isAscending ? "<=" : ">=";

    for (let i = 0; i < values.length - 1; i++) {
      const current = values[i];
      const next = values[i + 1];

      const isCorrectOrder =
        compareType === "date"
          ? this.compareDates(current, next, isAscending)
          : this.compareStrings(current, next, isAscending);

      assertLogger.assertTrue(
        `정렬 검증 [${i}] "${current}" ${compareSymbol} [${i + 1}] "${next}"`,
        isCorrectOrder,
      );
    }
  }

  private compareDates(
    current: string,
    next: string,
    isAscending: boolean,
  ): boolean {
    const currentDate = parseKoreanDate(current);
    const nextDate = parseKoreanDate(next);
    return isAscending ? currentDate <= nextDate : currentDate >= nextDate;
  }

  private compareStrings(
    current: string,
    next: string,
    isAscending: boolean,
  ): boolean {
    const comparison = current.localeCompare(next, "ko");
    return isAscending ? comparison <= 0 : comparison >= 0;
  }

  // ============================================
  // 체크박스 기능 (Ant Design Table rowSelection)
  // ============================================

  /** 헤더 체크박스 (전체 선택) */
  private get headerCheckbox(): Locator {
    return this.container.locator(SELECTOR.ANT_HEADER_CHECKBOX);
  }

  /** 특정 행의 체크박스 */
  private getRowCheckbox(rowIndex: number): Locator {
    // Ant Design 테이블의 데이터 행만 선택 (placeholder 제외)
    return this.container
      .locator(SELECTOR.ANT_TABLE_ROW)
      .nth(rowIndex)
      .locator(
        `${SELECTOR.ANT_SELECTION_COLUMN} ${SELECTOR.ANT_CHECKBOX_INPUT}`,
      );
  }

  /** 헤더 체크박스 클릭 (전체 선택/해제) */
  async clickHeaderCheckbox(): Promise<void> {
    await this.headerCheckbox.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 특정 행 체크박스 클릭 */
  async clickRowCheckbox(rowIndex: number): Promise<void> {
    await this.getRowCheckbox(rowIndex).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 헤더 체크박스 선택 상태 확인 */
  async isHeaderCheckboxChecked(): Promise<boolean> {
    return await this.headerCheckbox.isChecked();
  }

  /** 특정 행 체크박스 선택 상태 확인 */
  async isRowCheckboxChecked(rowIndex: number): Promise<boolean> {
    return await this.getRowCheckbox(rowIndex).isChecked();
  }

  /** 테이블의 체크박스가 있는 행 개수 반환 */
  private async getRowCheckboxCount(): Promise<number> {
    const rowCheckboxes = this.container.locator(
      `${SELECTOR.ANT_TABLE_ROW} ${SELECTOR.ANT_SELECTION_COLUMN} ${SELECTOR.ANT_CHECKBOX_INPUT}`,
    );
    return await rowCheckboxes.count();
  }

  /** 선택된 행의 개수 반환 */
  async getCheckedRowCount(): Promise<number> {
    const checkedCheckboxes = this.container.locator(
      `${SELECTOR.ANT_TABLE_ROW} ${SELECTOR.ANT_SELECTION_COLUMN} ${SELECTOR.ANT_CHECKBOX_CHECKED}`,
    );
    return await checkedCheckboxes.count();
  }

  /** 모든 행의 체크박스가 선택되어 있는지 확인 */
  async areAllRowsChecked(): Promise<boolean> {
    const [totalCheckboxes, checkedCount] = await Promise.all([
      this.getRowCheckboxCount(),
      this.getCheckedRowCount(),
    ]);
    return totalCheckboxes > 0 && totalCheckboxes === checkedCount;
  }

  /** 모든 행의 체크박스가 해제되어 있는지 확인 */
  async areAllRowsUnchecked(): Promise<boolean> {
    return (await this.getCheckedRowCount()) === 0;
  }

  /** 모든 체크박스 선택 상태 검증 */
  async assertAllRowsChecked(): Promise<void> {
    expect(await this.areAllRowsChecked()).toBe(true);
  }

  /** 모든 체크박스 해제 상태 검증 */
  async assertAllRowsUnchecked(): Promise<void> {
    expect(await this.areAllRowsUnchecked()).toBe(true);
  }
}
