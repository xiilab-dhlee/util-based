import { expect, type Locator, type Page } from "@playwright/test";

import { testId } from "@/shared/constants/selector.constant";

/**
 * Switch Component Object (험블 객체)
 *
 * Ant Design Switch 또는 유사 스위치 컴포넌트 조작을 캡슐화
 * - 스위치 토글
 * - 현재 상태 확인
 * - 상태 검증
 *
 * @example
 * const myItemsSwitch = new SwitchComponent(page, "workload-list-my-items-only-switch");
 * await myItemsSwitch.toggle();
 * const isChecked = await myItemsSwitch.isChecked();
 */
export class SwitchComponent {
  constructor(
    private page: Page,
    private switchTestId: string,
  ) {}

  /**
   * 스위치 요소 Locator
   */
  private get switch(): Locator {
    return this.page.locator(testId(this.switchTestId));
  }

  /**
   * 스위치 토글 (상태 반전)
   */
  async toggle(): Promise<void> {
    await this.switch.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 스위치가 체크 상태인지 확인
   *
   * @returns 체크 상태이면 true
   */
  async isChecked(): Promise<boolean> {
    // Ant Design Switch는 aria-checked 또는 class로 상태 확인
    const ariaChecked = await this.switch.getAttribute("aria-checked");
    if (ariaChecked !== null) {
      return ariaChecked === "true";
    }

    // xiilab-ui Switch는 checked 속성 사용
    const checked = await this.switch.isChecked().catch(() => false);
    return checked;
  }

  /**
   * 스위치가 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.switch).toBeVisible({ timeout });
  }

  /**
   * 스위치가 체크 상태인지 단언
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertChecked(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.switch).toBeChecked({ timeout });
  }

  /**
   * 스위치가 체크 해제 상태인지 단언
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertUnchecked(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.switch).not.toBeChecked({ timeout });
  }

  /**
   * 스위치가 활성화 상태인지 단언
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertEnabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.switch).toBeEnabled({ timeout });
  }

  /**
   * 스위치가 비활성화 상태인지 단언
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertDisabled(timeout = 10000): Promise<void> {
    await this.assertVisible(timeout);
    await expect(this.switch).toBeDisabled({ timeout });
  }
}
