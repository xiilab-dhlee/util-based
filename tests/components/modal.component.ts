import { expect, type Locator, type Page } from "@playwright/test";

import { SELECTOR } from "@/shared/constants/selector.constant";

/**
 * Ant Design Modal Component Object (험블 객체)
 *
 * Ant Design Modal 컴포넌트 조작을 캡슐화
 * - 모달 표시/숨김 확인
 * - 확인/취소 버튼 클릭
 *
 * @example
 * const modal = new ModalComponent(page);
 * await modal.waitForVisible();
 * await modal.clickOk();
 * await modal.waitForHidden();
 */
export class ModalComponent {
  constructor(private page: Page) {}

  /**
   * 모달 요소 Locator
   */
  private get modal(): Locator {
    return this.page.locator(SELECTOR.MODAL);
  }

  /**
   * 모달 콘텐츠 Locator
   */
  private get content(): Locator {
    return this.modal.locator(".ant-modal-content");
  }

  /**
   * 확인 버튼 Locator
   */
  private get okButton(): Locator {
    return this.page.locator(SELECTOR.MODAL_OK_BUTTON);
  }

  /**
   * 취소 버튼 Locator
   */
  private get cancelButton(): Locator {
    return this.page.locator(SELECTOR.MODAL_CANCEL_BUTTON);
  }

  /**
   * 모달 표시 여부 확인
   *
   * @returns 모달이 표시되어 있으면 true
   */
  async isVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  /**
   * 모달이 표시될 때까지 대기 (애니메이션 완료 포함)
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForVisible(timeout = 10000): Promise<void> {
    // 모달 컨테이너가 visible 상태인지 확인
    await expect(this.modal).toBeVisible({ timeout });

    // 모달 콘텐츠가 완전히 렌더링될 때까지 대기 (애니메이션 완료)
    await expect(this.content).toBeVisible({ timeout });
  }

  /**
   * 모달이 닫힐 때까지 대기
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForHidden(timeout = 10000): Promise<void> {
    await expect(this.modal).not.toBeVisible({ timeout });
  }

  /**
   * 확인 버튼 클릭
   */
  async clickOk(): Promise<void> {
    await expect(this.okButton).toBeVisible();
    await this.okButton.click();
  }

  /**
   * 취소 버튼 클릭
   */
  async clickCancel(): Promise<void> {
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }
}
