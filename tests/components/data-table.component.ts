import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

import {
  ANT_SELECTOR,
  SELECTOR,
  testId,
  testIdPrefix,
} from "@/shared/constants/selector.constant";
import type { AssertLogger } from "../fixtures";
import { DATE_PATTERN, DATETIME_PATTERN } from "../support/patterns";

type SortState = "asc" | "desc" | "none";
type SortOrder = "오름차순" | "내림차순";
type CompareType = "string" | "date";

/** 화면 표시용 날짜 파싱 (yyyy.MM.dd 또는 yyyy.MM.dd HH:mm:ss) */
const parseDisplayDate = (dateStr: string): number => {
  const isDateOnly = DATE_PATTERN.test(dateStr);
  const isDateTime = DATETIME_PATTERN.test(dateStr);

  if (!isDateOnly && !isDateTime) {
    throw new Error(`Invalid date format: "${dateStr}".`);
  }

  const [year, month, day] = dateStr.substring(0, 10).split(".").map(Number);

  if (isDateOnly) {
    return Date.UTC(year, month - 1, day);
  }

  const [hour, minute, second] = dateStr.substring(11).split(":").map(Number);
  return Date.UTC(year, month - 1, day, hour, minute, second);
};

/** Ant Design 데이터 테이블 컴포넌트 */
export class DataTableComponent {
  constructor(
    private container: Page | Locator,
    private columnTestId: string,
  ) {}

  private get page(): Page {
    return "page" in this.container && typeof this.container.page === "function"
      ? this.container.page()
      : (this.container as Page);
  }

  private get columns(): Locator {
    return this.container.locator(testId(this.columnTestId));
  }

  private get headerCheckbox(): Locator {
    return this.container.locator(ANT_SELECTOR.HEADER_CHECKBOX);
  }

  private async getTextContent(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? "").trim();
  }

  private getColumnHeader(columnTitle: string): Locator {
    return this.container
      .locator(ANT_SELECTOR.TABLE_HEADER)
      .filter({ hasText: new RegExp(`^${columnTitle}$`) })
      .first();
  }

  private getRowCheckbox(rowIndex: number): Locator {
    return this.container
      .locator(ANT_SELECTOR.TABLE_ROW)
      .nth(rowIndex)
      .locator(
        `${ANT_SELECTOR.SELECTION_COLUMN} ${ANT_SELECTOR.CHECKBOX_INPUT}`,
      );
  }

  private async getRowCheckboxCount(): Promise<number> {
    return await this.container.locator(ANT_SELECTOR.ROW_CHECKBOX).count();
  }

  private async getCurrentSortState(columnHeader: Locator): Promise<SortState> {
    const hasActiveClass = async (selector: string) =>
      await columnHeader
        .locator(selector)
        .first()
        .evaluate((el) => el.classList.contains("active"))
        .catch(() => false);

    if (await hasActiveClass(SELECTOR.SORT_ARROW_UP)) return "asc";
    if (await hasActiveClass(SELECTOR.SORT_ARROW_DOWN)) return "desc";
    return "none";
  }

  private toSortState(order: SortOrder): SortState {
    return order === "오름차순" ? "asc" : "desc";
  }

  private compareDates(a: string, b: string, asc: boolean): boolean {
    const dateA = parseDisplayDate(a);
    const dateB = parseDisplayDate(b);
    return asc ? dateA <= dateB : dateA >= dateB;
  }

  private compareStrings(a: string, b: string, asc: boolean): boolean {
    const cmp = a.localeCompare(b, "ko");
    return asc ? cmp <= 0 : cmp >= 0;
  }

  /** 테이블 행 개수 */
  async getRowCount(): Promise<number> {
    return await this.columns.count();
  }

  /** 특정 행의 Locator */
  async getRow(rowIndex: number): Promise<Locator> {
    return this.columns.nth(rowIndex).locator("xpath=ancestor::tr");
  }

  /** 첫 번째 행의 Locator */
  async getFirstRow(): Promise<Locator> {
    return this.getRow(0);
  }

  /** 특정 행의 셀 텍스트 */
  async getCellText(rowIndex: number, columnTestId: string): Promise<string> {
    const row = await this.getRow(rowIndex);
    return this.getTextContent(row.locator(testId(columnTestId)));
  }

  /** 특정 컬럼의 첫 번째 셀 텍스트 */
  async getFirstCellText(columnTestId: string): Promise<string> {
    return this.getTextContent(
      this.container.locator(testId(columnTestId)).first(),
    );
  }

  /** 특정 상태값을 가진 행 찾기 */
  async findRowByStatus(
    statusTestIdPrefix: string,
    statusValue: string,
  ): Promise<Locator | null> {
    const cell = this.container
      .locator(testId(`${statusTestIdPrefix}${statusValue}`))
      .first();

    if ((await cell.count()) === 0) return null;
    return cell.locator("xpath=ancestor::tr");
  }

  /** 선택된 행 개수 */
  async getCheckedRowCount(): Promise<number> {
    return await this.container
      .locator(ANT_SELECTOR.ROW_CHECKBOX_CHECKED)
      .count();
  }

  /** 헤더 체크박스 선택 여부 */
  async isHeaderCheckboxChecked(): Promise<boolean> {
    return await this.headerCheckbox.isChecked();
  }

  /** 특정 행 체크박스 선택 여부 */
  async isRowCheckboxChecked(rowIndex: number): Promise<boolean> {
    return await this.getRowCheckbox(rowIndex).isChecked();
  }

  /** 모든 행이 선택되었는지 확인 */
  async areAllRowsChecked(): Promise<boolean> {
    const [total, checked] = await Promise.all([
      this.getRowCheckboxCount(),
      this.getCheckedRowCount(),
    ]);
    return total > 0 && total === checked;
  }

  /** 모든 행이 해제되었는지 확인 */
  async areAllRowsUnchecked(): Promise<boolean> {
    return (await this.getCheckedRowCount()) === 0;
  }

  /** 로딩 스피너 사라질 때까지 대기 */
  async waitForLoaded(timeout = 10000): Promise<void> {
    await expect(this.container.locator(ANT_SELECTOR.SPINNER)).toBeHidden({
      timeout,
    });
  }

  /** 특정 행의 버튼 클릭 */
  async clickRowButton(row: Locator, buttonTestId: string): Promise<void> {
    await row.locator(testId(buttonTestId)).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** 첫 번째 셀 클릭 */
  async clickFirstCell(columnTestId: string): Promise<void> {
    await this.container.locator(testId(columnTestId)).first().click();
    await this.page.waitForLoadState("networkidle");
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

  /** 특정 컬럼 정렬 (최대 3번 클릭) */
  async sortByColumn(columnTitle: string, order: SortOrder): Promise<void> {
    await this.waitForLoaded();

    const columnHeader = this.getColumnHeader(columnTitle);
    const targetState = this.toSortState(order);

    if ((await this.getCurrentSortState(columnHeader)) === targetState) return;

    for (let i = 0; i < 3; i++) {
      await expect(columnHeader).toBeVisible();
      await columnHeader.click();
      await this.page.waitForLoadState("networkidle");
      await this.waitForLoaded();

      if ((await this.getCurrentSortState(columnHeader)) === targetState)
        return;
    }

    throw new Error(`${columnTitle} ${order} 정렬 실패`);
  }

  /** 특정 컬럼의 모든 셀 순회 */
  async forEachCell<T>(
    columnTestId: string,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const cells = this.container.locator(testId(columnTestId));
    const count = await cells.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      results.push(callback(await this.getTextContent(cells.nth(i)), i));
    }
    return results;
  }

  /** data-testid prefix로 요소 순회 */
  async forEachByPrefix<T>(
    testIdPrefixStr: string,
    callback: (extractedValue: string, index: number) => T,
  ): Promise<T[]> {
    const elements = this.container.locator(testIdPrefix(testIdPrefixStr));
    const count = await elements.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const testIdValue = await elements.nth(i).getAttribute("data-testid");
      results.push(
        callback(testIdValue?.replace(testIdPrefixStr, "") ?? "", i),
      );
    }
    return results;
  }

  /** 테이블이 표시되고 로딩 완료되었는지 검증 */
  async assertTableVisible(
    tableTestId: string,
    timeout = 10000,
  ): Promise<void> {
    await expect(this.container.locator(testId(tableTestId))).toBeVisible({
      timeout,
    });
    await this.waitForLoaded(timeout);
  }

  /** 빈 데이터 메시지 표시 검증 */
  async assertEmptyMessage(
    tableTestId: string,
    expectedMessage: string,
    timeout = 10000,
  ): Promise<void> {
    const placeholder = this.container
      .locator(testId(tableTestId))
      .locator(ANT_SELECTOR.TABLE_EMPTY);
    await expect(placeholder).toBeVisible({ timeout });
    await expect(placeholder).toContainText(expectedMessage);
  }

  /** 검색 결과가 검색어를 포함하는지 검증 (최대 3개 행) */
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
      return;
    }

    for (let i = 0; i < Math.min(rowCount, 3); i++) {
      const text = await this.getCellText(i, cellSelector);
      assertLogger.assertTrue(
        `${resultType}[${i}] "${text}"이(가) "${searchText}" 포함`,
        text.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
  }

  /** 정렬 화살표 활성화 검증 */
  async assertSortOrder(columnTitle: string, order: SortOrder): Promise<void> {
    const columnHeader = this.getColumnHeader(columnTitle);
    const arrow =
      order === "오름차순" ? SELECTOR.SORT_ARROW_UP : SELECTOR.SORT_ARROW_DOWN;

    await expect(
      columnHeader.locator(`${arrow}${SELECTOR.SORT_ACTIVE}`).first(),
    ).toBeVisible();
  }

  /** 테이블 데이터 정렬 순서 검증 */
  async assertDataSortOrder(
    cellSelector: string,
    order: SortOrder,
    assertLogger: AssertLogger,
    compareType: CompareType = "string",
  ): Promise<void> {
    const cells = this.container.locator(testId(cellSelector));
    const count = await cells.count();
    if (count < 2) return;

    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      values.push(await this.getTextContent(cells.nth(i)));
    }

    const asc = order === "오름차순";
    const symbol = asc ? "<=" : ">=";
    const compare =
      compareType === "date" ? this.compareDates : this.compareStrings;

    for (let i = 0; i < values.length - 1; i++) {
      assertLogger.assertTrue(
        `정렬 검증 [${i}] "${values[i]}" ${symbol} [${i + 1}] "${values[i + 1]}"`,
        compare.call(this, values[i], values[i + 1], asc),
      );
    }
  }

  /** 모든 행이 선택되었는지 검증 */
  async assertAllRowsChecked(): Promise<void> {
    expect(await this.areAllRowsChecked()).toBe(true);
  }

  /** 모든 행이 해제되었는지 검증 */
  async assertAllRowsUnchecked(): Promise<void> {
    expect(await this.areAllRowsUnchecked()).toBe(true);
  }
}
