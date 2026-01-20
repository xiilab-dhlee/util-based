import { expect, type Page } from "@playwright/test";

import {
  CREDENTIAL_SELECTOR,
  SETTING_SELECTOR,
  testId,
} from "@/shared/constants/selector.constant";
import { ButtonComponent } from "../components/button.component";
import { CreateCredentialModal } from "../modals/create-credential.modal";
import { BasePage } from "./base.page";

/**
 * 설정 페이지 Page Object
 *
 * 사용자 설정 페이지의 기능을 제공합니다.
 * Composition 패턴으로 모달 POM을 합성하여 사용합니다.
 *
 * @example
 * await settingPage.goto();
 * await settingPage.clickAddCredentialButton();
 * await settingPage.credentialModal.fillName("mycred");
 * await settingPage.credentialModal.submit();
 */
export class SettingPage extends BasePage {
  // ============================================
  // Instance Properties - 버튼
  // ============================================

  /** 크리덴셜 추가 버튼 */
  readonly addCredentialButton: ButtonComponent;

  // ============================================
  // Instance Properties - 모달 (Composition)
  // ============================================

  /** 크리덴셜 생성 모달 */
  readonly credentialModal: CreateCredentialModal;

  constructor(page: Page) {
    super(page);

    // 버튼 초기화
    this.addCredentialButton = new ButtonComponent(
      page,
      SETTING_SELECTOR.CREDENTIAL_ADD_BUTTON,
    );

    // 모달 합성
    this.credentialModal = new CreateCredentialModal(page);
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return SETTING_SELECTOR.PAGE_HEADER;
  }

  protected get basePath(): string {
    return "/user/setting";
  }

  // ============================================
  // Actions - 크리덴셜 추가 버튼
  // ============================================

  /**
   * 크리덴셜 추가 버튼 클릭
   */
  async clickAddCredentialButton(): Promise<void> {
    await this.addCredentialButton.click();
  }

  /**
   * 크리덴셜 추가 버튼 표시 확인
   */
  async assertAddCredentialButtonVisible(): Promise<void> {
    await this.addCredentialButton.assertVisible();
  }

  // ============================================
  // Assertions - 크리덴셜 목록
  // ============================================

  /**
   * 크리덴셜 목록에 특정 이름의 크리덴셜이 있는지 확인
   * @param name - 크리덴셜 이름
   */
  async assertCredentialInList(name: string): Promise<void> {
    const cardName = this.page.locator(testId(CREDENTIAL_SELECTOR.CARD_NAME), {
      hasText: name,
    });
    await expect(cardName).toBeVisible();
  }
}
