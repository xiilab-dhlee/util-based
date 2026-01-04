import { expect, type Page } from "@playwright/test";

import { ModalComponent } from "../components/modal.component";
import { generateRandomText } from "../support/test-helpers";

/**
 * 모든 모달의 기본 클래스
 *
 * 공통 기능:
 * - modal: ModalComponent 합성
 * - submit(): 확인 버튼 클릭
 * - cancel(): 취소 버튼 클릭
 * - waitForOpen(): 모달 열림 대기
 * - waitForClose(): 모달 닫힘 대기
 * - assertVisible(): 모달 표시 확인
 * - assertHidden(): 모달 숨김 확인
 *
 * SOLID - Single Responsibility: 모달 공통 동작만 담당
 * SOLID - Open/Closed: 확장에 열림, 수정에 닫힘
 *
 * @example
 * class MyModal extends BaseModal {
 *   protected get modalTestId() { return "my-modal"; }
 * }
 */
export abstract class BaseModal {
  /** 공통 모달 컴포넌트 (Ant Design Modal) */
  protected readonly modal: ModalComponent;

  constructor(protected readonly page: Page) {
    this.modal = new ModalComponent(page);
  }

  // ============================================
  // Abstract - 하위 클래스에서 구현 필수
  // ============================================

  /**
   * 모달 제목 (하위 클래스에서 정의)
   * xiilab-ui Modal은 data-testid를 DOM에 전달하지 않으므로
   * getByRole('dialog')로 모달을 찾을 때 사용
   *
   * @example "크리덴셜 추가", "워크로드 가져오기"
   */
  protected abstract get modalTitle(): string;

  // ============================================
  // Locators
  // ============================================

  /**
   * 모달 컨테이너 Locator
   * xiilab-ui Modal은 data-testid를 지원하지 않으므로
   * role="dialog"와 모달 제목으로 찾음
   */
  protected get modalLocator() {
    return this.page.getByRole("dialog", { name: this.modalTitle });
  }

  // ============================================
  // Actions - 공통 모달 동작
  // ============================================

  /**
   * 확인(추가/저장) 버튼 클릭
   */
  async submit(): Promise<void> {
    await this.modal.clickOk();
  }

  /**
   * 취소 버튼 클릭
   */
  async cancel(): Promise<void> {
    await this.modal.clickCancel();
  }

  /**
   * 모달이 열릴 때까지 대기
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForOpen(timeout = 10000): Promise<void> {
    await this.modal.waitForVisible(timeout);
    await expect(this.modalLocator).toBeVisible({ timeout });
  }

  /**
   * 모달이 닫힐 때까지 대기
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async waitForClose(timeout = 10000): Promise<void> {
    await expect(this.modalLocator).not.toBeVisible({ timeout });
  }

  // ============================================
  // Assertions - 모달 상태
  // ============================================

  /**
   * 모달이 표시되는지 확인
   *
   * @param timeout - 대기 시간 (기본 10초)
   */
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.modalLocator).toBeVisible({ timeout });
  }

  /**
   * 모달이 닫혔는지 확인
   */
  async assertHidden(): Promise<void> {
    await expect(this.modalLocator).not.toBeVisible();
  }

  // ============================================
  // Utilities - TestHelpers 위임
  // ============================================

  /**
   * 지정된 길이의 랜덤 테스트용 문자열 생성
   *
   * @param length - 생성할 문자열 길이
   * @returns 지정된 길이의 랜덤 문자열
   */
  protected generateRandomText(length: number): string {
    return generateRandomText(length);
  }
}
