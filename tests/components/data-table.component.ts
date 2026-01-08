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

/** 한국어 날짜 형식(yyyy.MM.dd) 파싱 - UTC 기반으로 결정적 timestamp 반환 */
const parseKoreanDate = (dateStr: string): number => {
  const parts = dateStr.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: "${dateStr}". Expected yyyy.MM.dd`);
  }

  const year = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10) - 1; // Date.UTC는 0-indexed month
  const day = Number.parseInt(parts[2], 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error(`Invalid date format: "${dateStr}". Expected yyyy.MM.dd`);
  }

  return Date.UTC(year, month, day);
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

  /**
   * 테이블의 전체 행 개수를 반환합니다.
   * @returns 테이블 행 개수
   */
  async getRowCount(): Promise<number> {
    return await this.columns.count();
  }

  /**
   * 특정 행의 특정 컬럼 셀 텍스트를 반환합니다.
   * @param rowIndex - 행 인덱스 (0-based)
   * @param columnTestId - 컬럼 셀의 data-testid
   * @returns 셀 텍스트 (trim 처리됨)
   */
  async getCellText(rowIndex: number, columnTestId: string): Promise<string> {
    const row = await this.getRow(rowIndex);
    const cell = row.locator(testId(columnTestId));
    return this.getTextContent(cell);
  }

  /**
   * 특정 인덱스의 행 Locator를 반환합니다.
   * @param rowIndex - 행 인덱스 (0-based)
   * @returns 해당 행의 tr Locator
   */
  async getRow(rowIndex: number): Promise<Locator> {
    return this.columns.nth(rowIndex).locator("xpath=ancestor::tr");
  }

  /**
   * 첫 번째 행의 Locator를 반환합니다.
   * @returns 첫 번째 행의 tr Locator
   */
  async getFirstRow(): Promise<Locator> {
    return this.getRow(0);
  }

  /**
   * 특정 상태값을 가진 행을 찾아 반환합니다.
   * @param statusTestIdPrefix - 상태 셀 data-testid의 prefix
   * @param statusValue - 찾고자 하는 상태 값
   * @returns 해당 상태를 가진 행의 tr Locator, 없으면 null
   */
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

  /**
   * 특정 행 내의 버튼을 클릭하고 네트워크 요청이 완료될 때까지 대기합니다.
   * @param row - 대상 행의 Locator
   * @param buttonTestId - 클릭할 버튼의 data-testid
   * @returns 클릭 및 네트워크 대기 완료 후 resolve
   */
  async clickRowButton(row: Locator, buttonTestId: string): Promise<void> {
    const button = row.locator(testId(buttonTestId));
    await button.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 특정 컬럼의 모든 셀을 순회하며 콜백을 실행합니다.
   * @template T - 콜백 반환 타입
   * @param columnTestId - 순회할 컬럼 셀의 data-testid
   * @param callback - 각 셀에 대해 실행할 콜백 함수 (text: 셀 텍스트, index: 행 인덱스)
   * @returns 각 셀에 대한 콜백 결과 배열
   */
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

  /**
   * 특정 prefix를 가진 data-testid 요소들을 순회하며 콜백을 실행합니다.
   * @template T - 콜백 반환 타입
   * @param testIdPrefixStr - data-testid prefix 문자열
   * @param callback - 각 요소에 대해 실행할 콜백 함수 (extractedValue: prefix 제거 후 값, index: 인덱스)
   * @returns 각 요소에 대한 콜백 결과 배열
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
   * 특정 컬럼의 첫 번째 셀 텍스트를 반환합니다.
   * @param columnTestId - 컬럼 셀의 data-testid
   * @returns 첫 번째 셀의 텍스트 (trim 처리됨)
   */
  async getFirstCellText(columnTestId: string): Promise<string> {
    const cell = this.container.locator(testId(columnTestId)).first();
    return this.getTextContent(cell);
  }

  /**
   * 특정 컬럼의 첫 번째 셀을 클릭하고 네트워크 요청이 완료될 때까지 대기합니다.
   * @param columnTestId - 클릭할 컬럼 셀의 data-testid
   * @returns 클릭 및 네트워크 대기 완료 후 resolve
   */
  async clickFirstCell(columnTestId: string): Promise<void> {
    const cell = this.container.locator(testId(columnTestId)).first();
    await cell.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 테이블 로딩 스피너가 사라질 때까지 대기합니다.
   * @param timeout - 최대 대기 시간 (ms, 기본값: 10000)
   * @returns 스피너가 사라지면 resolve
   */
  async waitForLoaded(timeout = 10000): Promise<void> {
    const spinner = this.container.locator(SELECTOR.ANT_SPINNER);
    await expect(spinner).toBeHidden({ timeout });
  }

  // ============================================
  // 테이블 상태 검증
  // ============================================

  /**
   * 테이블이 화면에 표시되고 로딩이 완료될 때까지 대기합니다.
   * @param tableTestId - 테이블 컨테이너의 data-testid
   * @param timeout - 최대 대기 시간 (ms, 기본값: 10000)
   * @returns 테이블이 표시되고 로딩이 완료되면 resolve
   */
  async assertTableVisible(
    tableTestId: string,
    timeout = 10000,
  ): Promise<void> {
    const table = this.container.locator(testId(tableTestId));
    await expect(table).toBeVisible({ timeout });
    await this.waitForLoaded(timeout);
  }

  /**
   * 테이블에 빈 데이터 메시지가 표시되는지 검증합니다.
   * @param tableTestId - 테이블 컨테이너의 data-testid
   * @param expectedMessage - 예상되는 빈 데이터 메시지 텍스트
   * @param timeout - 최대 대기 시간 (ms, 기본값: 10000)
   * @returns 빈 데이터 메시지가 올바르게 표시되면 resolve
   */
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

  /**
   * 검색 결과가 검색어를 포함하는지 검증합니다.
   * 최대 3개 행까지 검증하며, 검색 결과가 없으면 테스트를 스킵합니다.
   * @param searchText - 검색어
   * @param cellSelector - 검증할 셀의 data-testid
   * @param assertLogger - 검증 결과 로깅용 AssertLogger
   * @param testInfo - 테스트 스킵 처리용 TestInfo
   * @param resultType - 로그 메시지에 표시될 결과 유형 (기본값: "결과")
   * @returns 검증 완료 후 resolve
   * @throws testInfo.skip() - 검색 결과가 없을 경우 테스트를 스킵
   */
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

  /**
   * 특정 컬럼을 지정된 순서로 정렬합니다.
   * 이미 해당 순서이면 클릭하지 않고, 최대 3번 클릭하여 원하는 정렬 상태로 전환합니다.
   * @param columnTitle - 정렬할 컬럼 헤더 텍스트
   * @param order - 정렬 순서 ("오름차순" | "내림차순")
   * @returns 정렬이 완료되면 resolve
   */
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
      await expect(columnHeader).toBeVisible();
      await columnHeader.click();
      await this.page.waitForLoadState("networkidle");
      await this.waitForLoaded();

      currentState = await this.getCurrentSortState(columnHeader);
      if (currentState === targetState) {
        return;
      }
    }
  }

  /**
   * 컬럼 헤더의 정렬 화살표가 올바른 방향으로 활성화되어 있는지 검증합니다.
   * @param columnTitle - 검증할 컬럼 헤더 텍스트
   * @param order - 예상되는 정렬 순서 ("오름차순" | "내림차순")
   * @returns 정렬 화살표가 올바르게 표시되면 resolve
   */
  async assertSortOrder(columnTitle: string, order: SortOrder): Promise<void> {
    const columnHeader = this.getColumnHeader(columnTitle);

    const expectedArrowSelector =
      order === "오름차순" ? SELECTOR.SORT_ARROW_UP : SELECTOR.SORT_ARROW_DOWN;

    const activeArrow = columnHeader
      .locator(`${expectedArrowSelector}${SELECTOR.SORT_ACTIVE}`)
      .first();
    await expect(activeArrow).toBeVisible();
  }

  /**
   * 테이블 데이터가 실제로 올바른 순서로 정렬되어 있는지 검증합니다.
   * 인접한 행들의 값을 비교하여 정렬 순서가 올바른지 확인합니다.
   * @param cellSelector - 검증할 셀의 data-testid
   * @param order - 예상되는 정렬 순서 ("오름차순" | "내림차순")
   * @param assertLogger - 검증 결과 로깅용 AssertLogger
   * @param compareType - 비교 방식 ("string" | "date", 기본값: "string")
   * @returns 모든 행이 올바르게 정렬되어 있으면 resolve
   */
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

  /**
   * 헤더 체크박스를 클릭하여 전체 선택/해제를 토글합니다.
   * @returns 클릭 및 네트워크 대기 완료 후 resolve
   */
  async clickHeaderCheckbox(): Promise<void> {
    await this.headerCheckbox.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 특정 행의 체크박스를 클릭합니다.
   * @param rowIndex - 클릭할 행 인덱스 (0-based)
   * @returns 클릭 및 네트워크 대기 완료 후 resolve
   */
  async clickRowCheckbox(rowIndex: number): Promise<void> {
    await this.getRowCheckbox(rowIndex).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 헤더 체크박스의 선택 상태를 확인합니다.
   * @returns 헤더 체크박스가 선택되어 있으면 true
   */
  async isHeaderCheckboxChecked(): Promise<boolean> {
    return await this.headerCheckbox.isChecked();
  }

  /**
   * 특정 행 체크박스의 선택 상태를 확인합니다.
   * @param rowIndex - 확인할 행 인덱스 (0-based)
   * @returns 해당 행의 체크박스가 선택되어 있으면 true
   */
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

  /**
   * 현재 선택된 행의 개수를 반환합니다.
   * @returns 선택된 체크박스 개수
   */
  async getCheckedRowCount(): Promise<number> {
    const checkedCheckboxes = this.container.locator(
      `${SELECTOR.ANT_TABLE_ROW} ${SELECTOR.ANT_SELECTION_COLUMN} ${SELECTOR.ANT_CHECKBOX_CHECKED}`,
    );
    return await checkedCheckboxes.count();
  }

  /**
   * 모든 행의 체크박스가 선택되어 있는지 확인합니다.
   * @returns 모든 행이 선택되어 있으면 true, 행이 없거나 일부만 선택되면 false
   */
  async areAllRowsChecked(): Promise<boolean> {
    const [totalCheckboxes, checkedCount] = await Promise.all([
      this.getRowCheckboxCount(),
      this.getCheckedRowCount(),
    ]);
    return totalCheckboxes > 0 && totalCheckboxes === checkedCount;
  }

  /**
   * 모든 행의 체크박스가 해제되어 있는지 확인합니다.
   * @returns 선택된 행이 없으면 true
   */
  async areAllRowsUnchecked(): Promise<boolean> {
    return (await this.getCheckedRowCount()) === 0;
  }

  /**
   * 모든 행의 체크박스가 선택되어 있는지 검증합니다.
   * @returns 모든 행이 선택되어 있으면 resolve
   * @throws 하나라도 선택되지 않은 행이 있으면 assertion 실패
   */
  async assertAllRowsChecked(): Promise<void> {
    expect(await this.areAllRowsChecked()).toBe(true);
  }

  /**
   * 모든 행의 체크박스가 해제되어 있는지 검증합니다.
   * @returns 모든 행이 해제되어 있으면 resolve
   * @throws 선택된 행이 있으면 assertion 실패
   */
  async assertAllRowsUnchecked(): Promise<void> {
    expect(await this.areAllRowsUnchecked()).toBe(true);
  }
}
