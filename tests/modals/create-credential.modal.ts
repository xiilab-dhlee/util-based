import { expect, type Page } from "@playwright/test";

import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";
import { DropdownComponent } from "../components/dropdown.component";
import { FormItemComponent } from "../components/form-item.component";
import { InputComponent } from "../components/input.component";
import { BaseModal } from "./base.modal";

/**
 * 크리덴셜 생성 모달 Page Object
 *
 * BaseModal을 상속하여 공통 모달 기능 재사용
 * SettingPage에서 합성하여 사용
 *
 * @example
 * const modal = new CreateCredentialModal(page);
 * await modal.waitForOpen();
 * await modal.fillName("mycred");
 * await modal.selectType("Docker");
 * await modal.submit();
 */
export class CreateCredentialModal extends BaseModal {
  // ============================================
  // FormItem 컴포넌트 (라벨 + 입력창 + 에러메시지)
  // ============================================

  /** 타입 FormItem */
  readonly typeField: FormItemComponent;
  /** 이름 FormItem */
  readonly nameField: FormItemComponent;
  /** 설명 FormItem */
  readonly descriptionField: FormItemComponent;
  /** Private Registry URL FormItem */
  readonly registryUrlField: FormItemComponent;
  /** 아이디 FormItem */
  readonly userIdField: FormItemComponent;
  /** 토큰 FormItem */
  readonly tokenField: FormItemComponent;

  // ============================================
  // Input 컴포넌트 (실제 입력 요소)
  // ============================================

  /** 이름 입력 */
  readonly nameInput: InputComponent;
  /** 설명 입력 */
  readonly descriptionInput: InputComponent;
  /** Private Registry URL 입력 */
  readonly registryUrlInput: InputComponent;
  /** 아이디 입력 */
  readonly userIdInput: InputComponent;
  /** 토큰 입력 */
  readonly tokenInput: InputComponent;

  // ============================================
  // Dropdown 컴포넌트
  // ============================================

  /** 타입 드롭다운 */
  readonly typeDropdown: DropdownComponent;

  constructor(page: Page) {
    super(page);

    // FormItem 컴포넌트 초기화
    this.typeField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.TYPE_FIELD,
    );
    this.nameField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.NAME_FIELD,
    );
    this.descriptionField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.DESCRIPTION_FIELD,
    );
    this.registryUrlField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.REGISTRY_URL_FIELD,
    );
    this.userIdField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.USER_ID_FIELD,
    );
    this.tokenField = new FormItemComponent(
      page,
      CREDENTIAL_SELECTOR.TOKEN_FIELD,
    );

    // Input 컴포넌트 초기화
    this.nameInput = new InputComponent(page, CREDENTIAL_SELECTOR.NAME_INPUT);
    this.descriptionInput = new InputComponent(
      page,
      CREDENTIAL_SELECTOR.DESCRIPTION_INPUT,
    );
    this.registryUrlInput = new InputComponent(
      page,
      CREDENTIAL_SELECTOR.REGISTRY_URL_INPUT,
    );
    this.userIdInput = new InputComponent(
      page,
      CREDENTIAL_SELECTOR.USER_ID_INPUT,
    );
    this.tokenInput = new InputComponent(page, CREDENTIAL_SELECTOR.TOKEN_INPUT);

    // Dropdown 컴포넌트 초기화
    this.typeDropdown = new DropdownComponent(
      page,
      CREDENTIAL_SELECTOR.TYPE_FIELD,
    );
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get modalTitle(): string {
    return "크리덴셜 추가";
  }

  // ============================================
  // Field Input Actions
  // xiilab-ui 컴포넌트는 data-testid를 DOM에 전달하지 않으므로
  // 라벨 기반으로 필드를 찾아서 입력
  // ============================================

  /**
   * 라벨명으로 모달 내 textbox 찾기
   * @param label - 필드 라벨 (예: "이름", "아이디")
   */
  private getTextboxByLabel(label: string) {
    return this.modalLocator.getByRole("textbox", { name: new RegExp(label) });
  }

  /**
   * 이름 입력
   */
  async fillName(value: string): Promise<void> {
    await this.getTextboxByLabel("이름").fill(value);
  }

  /**
   * 설명 입력
   */
  async fillDescription(value: string): Promise<void> {
    await this.getTextboxByLabel("설명").fill(value);
  }

  /**
   * Private Registry URL 입력
   */
  async fillRegistryUrl(value: string): Promise<void> {
    await this.modalLocator
      .getByRole("textbox", { name: /Private Registry URL/i })
      .fill(value);
  }

  /**
   * 아이디 입력
   */
  async fillUserId(value: string): Promise<void> {
    await this.getTextboxByLabel("아이디").fill(value);
  }

  /**
   * 토큰 입력
   */
  async fillToken(value: string): Promise<void> {
    await this.getTextboxByLabel("토큰").fill(value);
  }

  /**
   * 타입 드롭다운에서 선택
   * xiilab-ui Dropdown은 Ant Design Select 기반
   *
   * @param typeName - 선택할 타입명 (예: "GitHub", "Docker")
   */
  async selectType(typeName: string): Promise<void> {
    // 드롭다운 클릭 - Ant Design Select의 selector 영역 클릭
    await this.modalLocator.locator(".ant-select-selector").first().click();
    // 드롭다운 옵션 선택 (드롭다운이 body에 렌더링됨)
    await this.page
      .locator(".ant-select-dropdown:visible .ant-select-item-option-content", {
        hasText: typeName,
      })
      .click();
  }

  /**
   * 필드명으로 값 입력
   * xiilab-ui 컴포넌트용 라벨 기반 입력
   *
   * @param fieldName - 필드명 (이름, 설명, Private Registry URL, 아이디, 토큰)
   * @param value - 입력할 값
   */
  async fillField(fieldName: string, value: string): Promise<void> {
    if (fieldName === "Private Registry URL") {
      await this.fillRegistryUrl(value);
    } else {
      await this.getTextboxByLabel(fieldName).fill(value);
    }
  }

  /**
   * DataTable로 여러 필드 한번에 입력
   * @param data - { field, value } 형태의 배열
   */
  async fillFields(
    data: Array<{ field: string; value: string }>,
  ): Promise<void> {
    for (const row of data) {
      if (row.field === "타입") {
        await this.selectType(row.value);
      } else {
        await this.fillField(row.field, row.value);
      }
    }
  }

  /**
   * 51자 문자열 입력 (maxLength 검증용)
   */
  async fillNameWith51Chars(): Promise<void> {
    await this.fillName(this.generateRandomText(51));
  }

  // ============================================
  // Assertions - 필드 상태
  // ============================================

  /**
   * Private Registry URL 필드 표시 확인
   */
  async assertRegistryUrlFieldVisible(): Promise<void> {
    await this.registryUrlField.assertVisible();
  }

  /**
   * Private Registry URL 필드 숨김 확인
   */
  async assertRegistryUrlFieldHidden(): Promise<void> {
    await expect(
      this.modalLocator.getByText("Private Registry URL", { exact: true }),
    ).not.toBeVisible();
  }

  /**
   * 특정 입력창이 빈 값인지 확인
   * xiilab-ui 컴포넌트용 라벨 기반 확인
   *
   * @param fieldName - 필드명
   */
  async assertFieldEmpty(fieldName: string): Promise<void> {
    const textbox = this.getTextboxByLabel(fieldName);
    await expect(textbox).toHaveValue("");
  }

  /**
   * 타입 선택값 확인
   * xiilab-ui Dropdown은 combobox 형제 요소에 선택된 값을 표시
   *
   * @param expectedType - 기대하는 타입명
   */
  async assertTypeValue(expectedType: string): Promise<void> {
    // 모달에서 기대하는 타입 값이 표시되는지 직접 확인
    // xiilab-ui Dropdown은 선택된 값을 generic 요소로 표시
    await expect(
      this.modalLocator.getByText(expectedType, { exact: true }),
    ).toBeVisible();
  }

  /**
   * 특정 필드에 에러 메시지가 표시되는지 확인
   * xiilab-ui 컴포넌트용 - 모달 내에서 에러 메시지 텍스트 직접 확인
   *
   * @param fieldName - 필드명
   * @param expectedMessage - 기대하는 에러 메시지
   */
  async assertFieldError(
    _fieldName: string,
    expectedMessage: string,
  ): Promise<void> {
    // 모달 내에서 에러 메시지가 표시되는지 확인
    // _fieldName은 API 호환성을 위해 유지하지만 xiilab-ui에서는 사용하지 않음
    await expect(this.modalLocator.getByText(expectedMessage)).toBeVisible();
  }
}
