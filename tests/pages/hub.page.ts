import { expect, type Locator } from "@playwright/test";

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
 * - 상세 영역: 허브 이름, README, 워크로드 생성 버튼
 *
 * NOTE: 목록 카드 관련 기능은 CardGridComponent(listGrid fixture) 활용
 * NOTE: 검색 입력창은 listSearchInput fixture 활용
 *
 * @example
 * const hubPage = new HubPage(page);
 * await hubPage.goto();
 * await hubPage.clickCreateWorkloadButton();
 */
export class HubPage extends BasePage {
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
  // 상세 영역 Assertions
  // ============================================

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
}
