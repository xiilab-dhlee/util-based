import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

import { testId, testIdPrefix } from "@/shared/constants/selector.constant";
import type { AssertLogger } from "../fixtures";

/**
 * 데이터 테이블 Component Object (험블 객체)
 *
 * Playwright 의존성을 격리하여 Step Definition의 복잡도를 낮춤
 * - 테이블 행 반복 처리 추상화
 * - 행 선택 및 버튼 클릭 캡슐화
 * - 상태별 행 찾기 기능
 *
 * ## ID 용도 구분
 *
 * ### columnTestId (constructor 파라미터)
 * - **용도**: 테이블 내 개별 셀/컬럼을 찾기 위한 data-testid
 * - **할당 위치**: 각 행의 특정 컬럼 요소 (td, span 등)
 * - **특징**: 여러 행에 걸쳐 반복됨 (각 행마다 동일한 ID)
 * - **예시**: "workload-name", "workload-job-type", "user-email"
 *
 * ### tableTestId (메서드 파라미터)
 * - **용도**: 테이블 컨테이너 자체를 찾기 위한 data-testid
 * - **할당 위치**: 테이블 래퍼나 리스트 컨테이너 요소
 * - **특징**: 페이지/컨테이너당 하나만 존재
 * - **예시**: "list-table", SELECTOR.LIST_TABLE
 *
 * @example
 * // 워크로드 목록 테이블 조작
 * const table = new DataTableComponent(
 *   page,
 *   WORKLOAD_SELECTOR.NAME // columnTestId: 각 행의 이름 셀을 찾기 위한 ID
 * );
 * const count = await table.getRowCount(); // 행 개수 조회
 *
 * // 테이블 가시성 검증
 * await table.assertTableVisible(
 *   SELECTOR.LIST_TABLE // tableTestId: 테이블 컨테이너를 찾기 위한 ID
 * );
 *
 * @example
 * // 모달 내 테이블 조작
 * const modal = page.locator('.ant-modal:visible');
 * const table = new DataTableComponent(
 *   modal,
 *   "member-name" // columnTestId: 멤버 이름 컬럼
 * );
 */
export class DataTableComponent {
  private container: Page | Locator;

  /**
   * 데이터 테이블 컴포넌트 생성
   *
   * @param pageOrContainer - 테이블을 포함하는 Page 또는 Locator (모달, 섹션 등)
   * @param columnTestId - 행 순회/조회에 사용할 기준 컬럼의 data-testid
   *                       예: "workload-name", "user-email"
   *                       이 ID는 각 행의 특정 셀에 할당되어 있어야 함
   */
  constructor(
    pageOrContainer: Page | Locator,
    private columnTestId: string,
  ) {
    this.container = pageOrContainer;
  }

  /**
   * Locator 타입인지 확인하는 타입 가드
   * Page와 Locator를 구분하여 안전한 타입 추론 제공
   */
  private isLocator(obj: Page | Locator): obj is Locator {
    return "page" in obj && typeof obj.page === "function";
  }

  /**
   * Page 객체 반환 (waitForLoadState 등에 사용)
   */
  private get page(): Page {
    return this.isLocator(this.container)
      ? this.container.page()
      : this.container;
  }

  /**
   * Locator의 텍스트 내용을 안전하게 추출
   * null 처리 및 trim을 중앙화하여 중복 제거
   */
  private async getTextContent(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? "").trim();
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
    return this.getTextContent(cell);
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
      const text = await this.getTextContent(cells.nth(i));
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
    return this.getTextContent(cell);
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

  /**
   * 테이블 로딩이 완료될 때까지 대기
   *
   * 통합테스트 환경에서 API 응답 대기를 위해:
   * - 스피너(.ant-spin)가 사라질 때까지 대기
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForLoaded(timeout = 10000): Promise<void> {
    const spinner = this.container.locator(".ant-spin");
    await expect(spinner).toBeHidden({ timeout });
  }

  // ============================================
  // 테이블 상태 검증
  // ============================================

  /**
   * 테이블 컨테이너가 표시되는지 확인하고 로딩 완료를 대기
   *
   * 테이블 래퍼 요소의 가시성을 확인한 후, 내부 스피너가 사라질 때까지 대기합니다.
   *
   * @param tableTestId - 테이블 컨테이너 요소의 data-testid
   *                      (constructor의 columnTestId와 다름: 이것은 컨테이너 자체의 ID)
   *                      예: SELECTOR.LIST_TABLE ("list-table")
   * @param timeout - 대기 시간 (기본 10초)
   *
   * @example
   * // 워크로드 목록 테이블 검증
   * const table = new DataTableComponent(page, WORKLOAD_SELECTOR.NAME);
   * await table.assertTableVisible(SELECTOR.LIST_TABLE);
   *
   * @example
   * // 커스텀 테이블 컨테이너 검증
   * await table.assertTableVisible("member-list-table");
   */
  async assertTableVisible(
    tableTestId: string,
    timeout = 10000,
  ): Promise<void> {
    const table = this.container.locator(testId(tableTestId));
    await expect(table).toBeVisible({ timeout });

    // 로딩 완료 대기
    await this.waitForLoaded(timeout);
  }

  /**
   * 테이블 빈 상태 메시지 검증
   *
   * Ant Design Table의 empty placeholder 텍스트를 확인합니다.
   * 테이블 컨테이너 내부의 빈 상태 메시지를 찾아 검증합니다.
   *
   * @param tableTestId - 테이블 컨테이너 요소의 data-testid
   *                      (constructor의 columnTestId와 다름: 이것은 컨테이너 자체의 ID)
   *                      예: SELECTOR.LIST_TABLE ("list-table")
   * @param expectedMessage - 기대하는 빈 상태 메시지 (부분 매칭)
   *                          예: "데이터 없음", "검색 결과가 없습니다"
   * @param timeout - 대기 시간 (기본 10초)
   *
   * @example
   * // 검색 결과 없음 메시지 검증
   * const table = new DataTableComponent(page, WORKLOAD_SELECTOR.NAME);
   * await table.assertEmptyMessage(
   *   SELECTOR.LIST_TABLE,
   *   "검색 결과가 없습니다"
   * );
   *
   * @example
   * // 빈 목록 메시지 검증
   * await table.assertEmptyMessage("user-list-table", "데이터 없음");
   */
  async assertEmptyMessage(
    tableTestId: string,
    expectedMessage: string,
    timeout = 10000,
  ): Promise<void> {
    const table = this.container.locator(testId(tableTestId));
    const emptyPlaceholder = table.locator(".ant-table-placeholder");
    await expect(emptyPlaceholder).toBeVisible({ timeout });
    await expect(emptyPlaceholder).toContainText(expectedMessage);
  }

  /**
   * 검색 결과 검증
   *
   * 최대 3개 행을 샘플링하여 검색어가 포함되어 있는지 검증
   *
   * @param searchText - 검색어
   * @param cellSelector - 검색 대상 셀 selector (예: WORKLOAD_SELECTOR.NAME)
   * @param assertLogger - 검증 로거
   * @param testInfo - 테스트 정보 (스킵 처리용)
   * @param resultType - 결과 타입 설명 (예: "워크로드")
   *
   * @example
   * // 워크로드 테이블 검색 검증
   * await table.validateSearch(
   *   await searchInput.getValue(),
   *   WORKLOAD_SELECTOR.NAME,
   *   assertLogger,
   *   testInfo,
   *   "워크로드"
   * );
   */
  async validateSearch(
    searchText: string,
    cellSelector: string,
    assertLogger: AssertLogger,
    testInfo: TestInfo,
    resultType = "결과",
  ): Promise<void> {
    const rowCount = await this.getRowCount();

    // 결과가 없으면 테스트 스킵
    if (rowCount === 0) {
      testInfo.skip(
        true,
        `"${searchText}" 검색 결과가 없어 검증을 스킵합니다. Mock 데이터 확인 필요.`,
      );
      return;
    }

    // 최대 3개 결과를 확인하여 false positives 방지
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
}
