import { expect, type Locator, type Page } from "@playwright/test";

import { HUB_SELECTOR, testId } from "@/shared/constants/selector.constant";
import { BasePage } from "./base.page";

/**
 * 허브 페이지 Page Object
 *
 * 허브 페이지는 마스터-디테일 구조로, 왼쪽에 목록, 오른쪽에 상세가 동시에 표시됩니다.
 * - 진입점: /user/hub → 첫 번째 허브 상세 페이지로 자동 리다이렉트
 * - 실제 URL: /user/hub/[id]?name=hubName
 *
 * BasePage를 상속하여 허브 페이지 전용 기능 제공:
 * - 목록 영역: 카드 그리드, 검색
 * - 상세 영역: 허브 이름, README, 워크로드 생성 버튼
 *
 * @example
 * const hubPage = new HubPage(page);
 * await hubPage.goto();
 * await hubPage.clickHubCard(0);
 * await hubPage.clickCreateWorkloadButton();
 */
export class HubPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return HUB_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return "/user/hub";
  }

  // ============================================
  // 목록 영역 Locators
  // ============================================

  /** 허브 카드 목록 */
  get hubCards(): Locator {
    return this.page.locator(testId(HUB_SELECTOR.CARD));
  }

  /** 검색 입력창 */
  get searchInput(): Locator {
    return this.page.locator('[data-testid="list-search-input"]');
  }

  /** 총 개수 표시 */
  get totalCount(): Locator {
    return this.page.locator('[data-testid="list-total-count"]');
  }

  // ============================================
  // 상세 영역 Locators
  // ============================================

  /** 허브 상세 헤더 이름 */
  get detailName(): Locator {
    return this.page.locator(testId(HUB_SELECTOR.DETAIL_NAME));
  }

  /** 허브 README 콘텐츠 */
  get readmeContent(): Locator {
    return this.page.locator(testId(HUB_SELECTOR.DETAIL_README));
  }

  /** 워크로드 생성 버튼 */
  get createWorkloadButton(): Locator {
    return this.page.locator(testId(HUB_SELECTOR.CREATE_WORKLOAD_BUTTON));
  }

  // ============================================
  // 목록 영역 Actions
  // ============================================

  /**
   * 허브 카드 개수 반환
   */
  async getHubCardCount(): Promise<number> {
    return await this.hubCards.count();
  }

  /**
   * 특정 인덱스의 허브 카드 클릭
   * @param index - 카드 인덱스 (0-based)
   */
  async clickHubCard(index: number): Promise<void> {
    await this.hubCards.nth(index).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 특정 인덱스의 허브 카드 이름 반환
   * @param index - 카드 인덱스 (0-based)
   */
  async getHubCardName(index: number): Promise<string> {
    const card = this.hubCards.nth(index);
    const nameElement = card.locator(testId(HUB_SELECTOR.NAME));
    return ((await nameElement.textContent()) ?? "").trim();
  }

  /**
   * 특정 인덱스의 허브 카드 모델 타입 반환
   * @param index - 카드 인덱스 (0-based)
   */
  async getHubCardModelType(index: number): Promise<string> {
    const card = this.hubCards.nth(index);
    const modelTypeElement = card.locator(testId(HUB_SELECTOR.MODEL_TYPE));
    return ((await modelTypeElement.textContent()) ?? "").trim();
  }

  /**
   * 검색 수행
   * @param keyword - 검색어
   */
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 검색창 입력값 반환
   */
  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * 모든 허브 카드에 대해 콜백 실행
   * @param callback - 각 카드에서 실행할 콜백 (index)
   */
  async forEachCard<T>(callback: (index: number) => Promise<T>): Promise<T[]> {
    const count = await this.getHubCardCount();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      results.push(await callback(i));
    }

    return results;
  }

  // ============================================
  // 상세 영역 Actions
  // ============================================

  /**
   * 특정 허브 상세 페이지로 이동
   * @param hubId - 허브 ID
   * @param hubName - 허브 이름 (optional)
   */
  async gotoDetail(hubId: number | string, hubName?: string): Promise<void> {
    const path = hubName
      ? `/${hubId}?name=${encodeURIComponent(hubName)}`
      : `/${hubId}`;
    await this.goto(path);
  }

  /**
   * 허브 상세 이름 반환
   */
  async getDetailName(): Promise<string> {
    return ((await this.detailName.textContent()) ?? "").trim();
  }

  /**
   * 워크로드 생성 버튼 클릭
   */
  async clickCreateWorkloadButton(): Promise<void> {
    await this.createWorkloadButton.click();
  }

  // ============================================
  // 목록 영역 Assertions
  // ============================================

  /**
   * 허브 카드가 표시되는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertHubCardsVisible(timeout = 10000): Promise<void> {
    await expect(this.hubCards.first()).toBeVisible({ timeout });
  }

  // ============================================
  // 상세 영역 Assertions
  // ============================================

  /**
   * 상세 영역이 표시되는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertDetailVisible(timeout = 10000): Promise<void> {
    await expect(this.detailName).toBeVisible({ timeout });
  }

  /**
   * 허브 상세 이름이 표시되는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertDetailNameVisible(timeout = 10000): Promise<void> {
    await expect(this.detailName).toBeVisible({ timeout });
  }

  /**
   * README 콘텐츠가 표시되는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertReadmeVisible(timeout = 10000): Promise<void> {
    await expect(this.readmeContent).toBeVisible({ timeout });
  }

  /**
   * 워크로드 생성 버튼이 표시되는지 확인
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertCreateWorkloadButtonVisible(timeout = 10000): Promise<void> {
    await expect(this.createWorkloadButton).toBeVisible({ timeout });
  }

  /**
   * 워크로드 생성 버튼이 활성화되어 있는지 확인
   */
  async assertCreateWorkloadButtonEnabled(): Promise<void> {
    await expect(this.createWorkloadButton).toBeEnabled();
  }
}
