import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

import { SELECTOR, testId } from "@/shared/constants/selector.constant";
import type { AssertLogger } from "../fixtures";

/**
 * 카드 그리드 Component Object (험블 객체)
 *
 * Playwright 의존성을 격리하여 Step Definition의 복잡도를 낮춤
 * - 그리드 내 카드 반복 처리 추상화
 * - 카드 클릭 및 선택 상태 확인 캡슐화
 * - DataTableComponent의 카드형 대응
 *
 * ## ID 용도 구분
 *
 * ### cardTestId (constructor 파라미터)
 * - **용도**: 그리드 내 개별 카드를 찾기 위한 data-testid
 * - **할당 위치**: 각 카드 요소
 * - **특징**: 여러 카드에 걸쳐 반복됨 (각 카드마다 동일한 ID)
 * - **예시**: "hub-card", "template-card"
 *
 * ### gridTestId
 * - **용도**: 그리드 컨테이너 자체를 찾기 위한 data-testid
 * - **할당 위치**: 그리드 래퍼 요소
 * - **특징**: 기본값 SELECTOR.LIST_CARD_GRID 사용
 * - **예시**: "list-card-grid"
 *
 * @example
 * // 허브 카드 그리드 조작
 * const grid = new CardGridComponent(
 *   page,
 *   HUB_SELECTOR.CARD // cardTestId: 각 카드를 찾기 위한 ID
 * );
 * const count = await grid.getCardCount(); // 카드 개수 조회
 *
 * // 그리드 가시성 검증
 * await grid.assertGridVisible();
 *
 * @example
 * // 카드 클릭
 * await grid.clickCard(0); // 첫 번째 카드 클릭
 */
export class CardGridComponent {
  private container: Page | Locator;
  private gridTestId: string;

  /**
   * 카드 그리드 컴포넌트 생성
   *
   * @param pageOrContainer - 그리드를 포함하는 Page 또는 Locator
   * @param cardTestId - 카드 순회/조회에 사용할 data-testid
   *                     예: "hub-card", "template-card"
   * @param gridTestId - 그리드 컨테이너의 data-testid (기본값: LIST_CARD_GRID)
   */
  constructor(
    pageOrContainer: Page | Locator,
    private cardTestId: string,
    gridTestId?: string,
  ) {
    this.container = pageOrContainer;
    this.gridTestId = gridTestId ?? SELECTOR.LIST_CARD_GRID;
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
   * 그리드 컨테이너 Locator
   */
  get grid(): Locator {
    return this.container.locator(testId(this.gridTestId));
  }

  /**
   * 카드 요소들의 Locator
   */
  get cards(): Locator {
    return this.container.locator(testId(this.cardTestId));
  }

  // ============================================
  // 카드 조회
  // ============================================

  /**
   * 카드 개수 반환
   */
  async getCardCount(): Promise<number> {
    return await this.cards.count();
  }

  /**
   * 특정 인덱스의 카드 Locator 반환
   *
   * @param index - 카드 인덱스 (0-based)
   */
  getCard(index: number): Locator {
    return this.cards.nth(index);
  }

  /**
   * 첫 번째 카드 Locator 반환
   */
  getFirstCard(): Locator {
    return this.cards.first();
  }

  /**
   * 특정 인덱스의 카드에서 지정된 요소의 텍스트 반환
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   * @param elementTestId - 카드 내 요소의 data-testid
   */
  async getCardElementText(
    cardIndex: number,
    elementTestId: string,
  ): Promise<string> {
    const card = this.getCard(cardIndex);
    const element = card.locator(testId(elementTestId));
    return this.getTextContent(element);
  }

  /**
   * 특정 인덱스의 카드에서 지정된 요소 내부의 자식 요소 속성 반환
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   * @param elementTestId - 카드 내 요소의 data-testid
   * @param childSelector - 자식 요소 셀렉터 (예: "img", "a")
   * @param attribute - 가져올 속성명 (예: "src", "href")
   */
  async getCardElementAttribute(
    cardIndex: number,
    elementTestId: string,
    childSelector: string,
    attribute: string,
  ): Promise<string> {
    const card = this.getCard(cardIndex);
    const element = card.locator(testId(elementTestId)).locator(childSelector);
    return (await element.getAttribute(attribute)) ?? "";
  }

  /**
   * 첫 번째 카드의 특정 요소 텍스트 반환
   *
   * @param elementTestId - 카드 내 요소의 data-testid
   */
  async getFirstCardElementText(elementTestId: string): Promise<string> {
    return this.getCardElementText(0, elementTestId);
  }

  /**
   * 특정 인덱스의 카드 제목(title) 반환
   * xiilab-ui Card 컴포넌트의 title은 h6 태그로 렌더링됨
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   */
  async getCardTitle(cardIndex: number): Promise<string> {
    const card = this.getCard(cardIndex);
    const titleElement = card.locator("h6");
    return this.getTextContent(titleElement);
  }

  /**
   * 특정 인덱스의 카드 설명(description) 반환
   * xiilab-ui Card 컴포넌트의 description은 첫 번째 p 태그로 렌더링됨
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   */
  async getCardDescription(cardIndex: number): Promise<string> {
    const card = this.getCard(cardIndex);
    const descElement = card.locator("p").first();
    return this.getTextContent(descElement);
  }

  // ============================================
  // 카드 인터랙션
  // ============================================

  /**
   * 특정 인덱스의 카드 클릭
   *
   * @param index - 카드 인덱스 (0-based)
   */
  async clickCard(index: number): Promise<void> {
    await this.cards.nth(index).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 첫 번째 카드 클릭
   */
  async clickFirstCard(): Promise<void> {
    await this.clickCard(0);
  }

  /**
   * 카드 내의 특정 버튼 클릭
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   * @param buttonTestId - 버튼의 data-testid
   */
  async clickCardButton(
    cardIndex: number,
    buttonTestId: string,
  ): Promise<void> {
    const card = this.getCard(cardIndex);
    const button = card.locator(testId(buttonTestId));
    await button.click();
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // 순회 메서드
  // ============================================

  /**
   * 모든 카드에 대해 콜백 함수 실행
   *
   * @param callback - 각 카드에서 실행할 콜백 (index)
   * @returns 콜백 결과 배열
   *
   * @example
   * await grid.forEachCard(async (index) => {
   *   const name = await grid.getCardElementText(index, HUB_SELECTOR.NAME);
   *   assertLogger.assertNotEmpty(`카드[${index}] 이름`, name);
   * });
   */
  async forEachCard<T>(callback: (index: number) => Promise<T>): Promise<T[]> {
    const count = await this.getCardCount();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      results.push(await callback(i));
    }

    return results;
  }

  /**
   * 모든 카드의 특정 요소 텍스트에 대해 콜백 실행
   *
   * @param elementTestId - 카드 내 요소의 data-testid
   * @param callback - 각 요소에서 실행할 콜백 (text, index)
   * @returns 콜백 결과 배열
   *
   * @example
   * await grid.forEachCardElement(HUB_SELECTOR.NAME, (text, i) => {
   *   assertLogger.assertNotEmpty(`카드[${i}] 이름`, text);
   * });
   */
  async forEachCardElement<T>(
    elementTestId: string,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const cardCount = await this.getCardCount();
    const results: T[] = [];

    for (let i = 0; i < cardCount; i++) {
      const text = await this.getCardElementText(i, elementTestId);
      results.push(callback(text, i));
    }

    return results;
  }

  // ============================================
  // 상태 검증
  // ============================================

  /**
   * 그리드 컨테이너가 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertGridVisible(timeout = 10000): Promise<void> {
    await expect(this.grid).toBeVisible({ timeout });
  }

  /**
   * 카드가 하나 이상 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertCardsVisible(timeout = 10000): Promise<void> {
    await expect(this.cards.first()).toBeVisible({ timeout });
  }

  /**
   * 그리드가 비어있는지 확인 (카드 개수가 0)
   */
  async assertGridEmpty(): Promise<void> {
    const count = await this.getCardCount();
    expect(count).toBe(0);
  }

  /**
   * 그리드에 특정 개수 이상의 카드가 있는지 확인
   *
   * @param minCount - 최소 카드 개수
   */
  async assertMinCardCount(minCount: number): Promise<void> {
    const count = await this.getCardCount();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  /**
   * 특정 인덱스의 카드에서 지정된 요소가 표시되는지 확인
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   * @param elementTestId - 카드 내 요소의 data-testid
   */
  async assertCardElementVisible(
    cardIndex: number,
    elementTestId: string,
  ): Promise<void> {
    const card = this.getCard(cardIndex);
    const element = card.locator(testId(elementTestId));
    await expect(element).toBeVisible();
  }

  /**
   * 특정 인덱스의 카드에서 지정된 요소가 존재하는지 확인 (표시 여부 무관)
   *
   * @param cardIndex - 카드 인덱스 (0-based)
   * @param elementTestId - 카드 내 요소의 data-testid
   * @returns 요소 존재 여부
   */
  async hasCardElement(
    cardIndex: number,
    elementTestId: string,
  ): Promise<boolean> {
    const card = this.getCard(cardIndex);
    const element = card.locator(testId(elementTestId));
    return (await element.count()) > 0;
  }

  /**
   * 특정 인덱스의 카드가 선택된 상태인지 확인
   *
   * @param index - 카드 인덱스 (0-based)
   */
  async assertCardSelected(index: number): Promise<void> {
    const card = this.getCard(index);
    await expect(card).toHaveAttribute("aria-selected", "true");
  }

  /**
   * 검색 결과 검증
   *
   * 최대 3개 카드를 샘플링하여 검색어가 포함되어 있는지 검증
   *
   * @param searchText - 검색어
   * @param assertLogger - 검증 로거
   * @param testInfo - 테스트 정보 (스킵 처리용)
   * @param resultType - 결과 타입 설명 (예: "허브")
   *
   * @example
   * // 허브 카드 그리드 검색 검증
   * await grid.validateSearch(
   *   await searchInput.getValue(),
   *   assertLogger,
   *   testInfo,
   *   "허브"
   * );
   */
  async validateSearch(
    searchText: string,
    assertLogger: AssertLogger,
    testInfo: TestInfo,
    resultType = "결과",
  ): Promise<void> {
    const cardCount = await this.getCardCount();

    // 결과가 없으면 테스트 스킵
    if (cardCount === 0) {
      testInfo.skip(
        true,
        `"${searchText}" 검색 결과가 없어 검증을 스킵합니다. Mock 데이터 확인 필요.`,
      );
      return;
    }

    // 최대 3개 결과를 확인하여 false positives 방지
    const checkCount = Math.min(cardCount, 3);
    for (let i = 0; i < checkCount; i++) {
      const text = await this.getCardTitle(i);
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
