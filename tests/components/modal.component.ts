import { expect, type Locator, type Page } from "@playwright/test";

import { ANT_SELECTOR } from "@/shared/constants/selector.constant";

/** Ant Design Modal 컴포넌트 */
export class ModalComponent {
  constructor(private page: Page) {}

  private get modal(): Locator {
    return this.page.locator(ANT_SELECTOR.MODAL);
  }

  private get content(): Locator {
    return this.modal.locator(ANT_SELECTOR.MODAL_CONTENT);
  }

  private get title(): Locator {
    return this.page.locator(ANT_SELECTOR.MODAL_TITLE);
  }

  private get okButton(): Locator {
    return this.page.locator(ANT_SELECTOR.MODAL_OK_BUTTON);
  }

  private get cancelButton(): Locator {
    return this.page.locator(ANT_SELECTOR.MODAL_CANCEL_BUTTON);
  }

  /** 모달 표시 여부 확인 */
  async isVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  /** 모달이 표시될 때까지 대기 */
  async waitForVisible(timeout = 10000): Promise<void> {
    await expect(this.modal).toBeVisible({ timeout });
    await expect(this.content).toBeVisible({ timeout });
  }

  /** 특정 제목의 모달이 표시될 때까지 대기 */
  async waitForVisibleWithTitle(
    expectedTitle: string,
    timeout = 10000,
  ): Promise<void> {
    await this.waitForVisible(timeout);
    await expect(this.title).toHaveText(expectedTitle, { timeout });
  }

  /** 모달이 닫힐 때까지 대기 */
  async waitForHidden(timeout = 10000): Promise<void> {
    await expect(this.modal).not.toBeVisible({ timeout });
  }

  /** 확인 버튼 클릭 */
  async clickOk(): Promise<void> {
    await expect(this.okButton).toBeVisible();
    await this.okButton.click();
  }

  /** 취소 버튼 클릭 */
  async clickCancel(): Promise<void> {
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }
}
