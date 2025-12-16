import { expect, type Locator, type Page } from "@playwright/test";

import { testId, testIdPrefix } from "@/shared/constants/selector.constant";

/**
 * Card List Component Object (험블 객체)
 *
 * 카드 목록(이벤트, 소스코드 등) 반복 처리를 캡슐화
 * - 카드 개수 확인
 * - 각 카드의 요소 순회
 * - testIdPrefix 기반 요소 순회
 *
 * @example
 * const eventCards = new CardListComponent(page, WORKLOAD_SELECTOR.EVENT_CARD);
 * const count = await eventCards.getCount();
 * await eventCards.forEachCard("h6", async (element, i) => {
 *   const text = await element.textContent();
 *   console.log(`카드[${i}] 이름: ${text}`);
 * });
 */
export class CardListComponent {
  constructor(
    private page: Page,
    private cardTestId: string,
  ) {}

  /**
   * 카드 요소들의 Locator
   */
  private get cards(): Locator {
    return this.page.locator(testId(this.cardTestId));
  }

  /**
   * 카드 개수 반환
   *
   * @returns 카드 개수
   */
  async getCount(): Promise<number> {
    return await this.cards.count();
  }

  /**
   * 각 카드의 지정된 자식 요소에 대해 콜백 실행
   *
   * @param childSelector - 자식 요소 CSS 셀렉터 (예: "h6", ".title")
   * @param callback - 각 요소에서 실행할 콜백 (element, index)
   * @returns 콜백 결과 배열
   *
   * @example
   * await cardList.forEachCard("h6", async (element, i) => {
   *   await assertLogger.assertLocatorText(`카드[${i}] 이름`, element);
   * });
   */
  async forEachCard<T>(
    childSelector: string,
    callback: (element: Locator, index: number) => Promise<T>,
  ): Promise<T[]> {
    const count = await this.cards.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const cardElement = this.cards.nth(i).locator(childSelector);
      results.push(await callback(cardElement, i));
    }

    return results;
  }

  /**
   * 각 카드의 지정된 자식 요소 텍스트에 대해 콜백 실행
   *
   * @param childSelector - 자식 요소 CSS 셀렉터
   * @param callback - 각 텍스트에서 실행할 콜백 (text, index)
   * @returns 콜백 결과 배열
   */
  async forEachCardText<T>(
    childSelector: string,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const count = await this.cards.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const element = this.cards.nth(i).locator(childSelector);
      const text = ((await element.textContent()) ?? "").trim();
      results.push(callback(text, i));
    }

    return results;
  }

  /**
   * 특정 인덱스의 카드에서 자식 요소 텍스트 반환
   *
   * @param index - 카드 인덱스 (0-based)
   * @param childSelector - 자식 요소 CSS 셀렉터
   * @returns 텍스트 내용
   */
  async getCardText(index: number, childSelector: string): Promise<string> {
    const element = this.cards.nth(index).locator(childSelector);
    return ((await element.textContent()) ?? "").trim();
  }

  /**
   * testIdPrefix로 요소들을 찾아 순회
   * 동적 testId 처리 (예: workload-event-status-running)
   *
   * @param testIdPrefixStr - testId prefix (예: "workload-event-status-")
   * @param callback - 각 요소에서 실행할 콜백 (extractedValue, index)
   * @returns 콜백 결과 배열
   *
   * @example
   * await cardList.forEachByPrefix("workload-event-status-", (status, i) => {
   *   assertLogger.assertContains(`이벤트[${i}] 상태`, status, validStatuses);
   * });
   */
  async forEachByPrefix<T>(
    testIdPrefixStr: string,
    callback: (extractedValue: string, index: number) => T,
  ): Promise<T[]> {
    const elements = this.page.locator(testIdPrefix(testIdPrefixStr));
    const count = await elements.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      await expect(element).toBeVisible();

      const testIdValue = await element.getAttribute("data-testid");
      const extractedValue = testIdValue?.replace(testIdPrefixStr, "") ?? "";
      results.push(callback(extractedValue, i));
    }

    return results;
  }

  /**
   * testIdPrefix로 요소들을 찾아 순회 (attached 확인)
   * DOM에 연결되어 있지만 보이지 않을 수 있는 요소용
   *
   * @param testIdPrefixStr - testId prefix
   * @param callback - 각 요소에서 실행할 콜백
   * @returns 콜백 결과 배열
   */
  async forEachByPrefixAttached<T>(
    testIdPrefixStr: string,
    callback: (extractedValue: string, index: number) => T,
  ): Promise<T[]> {
    const elements = this.page.locator(testIdPrefix(testIdPrefixStr));
    const count = await elements.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      await expect(element).toBeAttached();

      const testIdValue = await element.getAttribute("data-testid");
      const extractedValue = testIdValue?.replace(testIdPrefixStr, "") ?? "";
      results.push(callback(extractedValue, i));
    }

    return results;
  }
}
