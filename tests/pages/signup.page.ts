import { expect, type Page } from "@playwright/test";

import { AUTH_SELECTOR, testId } from "@/shared/constants/selector.constant";
import { ButtonComponent } from "../components/button.component";
import { DropdownComponent } from "../components/dropdown.component";
import { FormItemComponent } from "../components/form-item.component";
import { InputComponent } from "../components/input.component";
import { LinkComponent } from "../components/link.component";
import { BasePage } from "./base.page";

/**
 * 회원가입 페이지 Page Object
 *
 * 회원가입 폼의 필드 입력, 에러 메시지 검증, 제출 기능 제공
 *
 * @example
 * await signupPage.goto();
 * await signupPage.fillEmail("user@example.com");
 * await signupPage.clickSubmit();
 * await signupPage.assertFieldError("email", "이메일을 입력해 주세요.");
 */
export class SignupPage extends BasePage {
  // ============================================
  // Instance Properties - FormItem 험블 객체
  // ============================================

  /** Email FormItem 컴포넌트 */
  readonly emailField: FormItemComponent;
  /** Password FormItem 컴포넌트 */
  readonly passwordField: FormItemComponent;
  /** Confirm Password FormItem 컴포넌트 */
  readonly confirmPasswordField: FormItemComponent;
  /** First Name FormItem 컴포넌트 */
  readonly firstNameField: FormItemComponent;
  /** Last Name FormItem 컴포넌트 */
  readonly lastNameField: FormItemComponent;
  /** Group Name FormItem 컴포넌트 */
  readonly groupNameField: FormItemComponent;

  // ============================================
  // Instance Properties - Input 험블 객체
  // ============================================

  /** Email 입력 컴포넌트 */
  readonly emailInput: InputComponent;
  /** Password 입력 컴포넌트 */
  readonly passwordInput: InputComponent;
  /** Confirm Password 입력 컴포넌트 */
  readonly confirmPasswordInput: InputComponent;
  /** First Name 입력 컴포넌트 */
  readonly firstNameInput: InputComponent;
  /** Last Name 입력 컴포넌트 */
  readonly lastNameInput: InputComponent;

  // ============================================
  // Instance Properties - Dropdown 험블 객체
  // ============================================

  /** Group Name 드롭다운 컴포넌트 */
  readonly groupNameDropdown: DropdownComponent;

  // ============================================
  // Instance Properties - Button 험블 객체
  // ============================================

  /** 회원가입 버튼 컴포넌트 */
  readonly submitButton: ButtonComponent;
  /** 로그인 페이지로 이동 버튼 (회원가입 성공 후) */
  readonly goToLoginButton: ButtonComponent;

  // ============================================
  // Instance Properties - Link 험블 객체
  // ============================================

  /** 로그인 링크 컴포넌트 */
  readonly loginLink: LinkComponent;

  // ============================================
  // Private - Field Mapping (DRY 원칙)
  // ============================================

  /**
   * 필드명 → Input 컴포넌트 매핑
   */
  private get inputFieldMap(): Record<string, InputComponent> {
    return {
      Email: this.emailInput,
      Password: this.passwordInput,
      "Confirm Password": this.confirmPasswordInput,
      "First Name": this.firstNameInput,
      "Last Name": this.lastNameInput,
    };
  }

  /**
   * 필드명 → FormItem 컴포넌트 매핑 (에러 검증용, Group Name 제외)
   */
  private get formFieldMap(): Record<string, FormItemComponent> {
    return {
      Email: this.emailField,
      Password: this.passwordField,
      "Confirm Password": this.confirmPasswordField,
      "First Name": this.firstNameField,
      "Last Name": this.lastNameField,
    };
  }

  /**
   * 필드명 → FormItem 컴포넌트 매핑 (렌더링 검증용, Group Name 포함)
   */
  private get allFieldMap(): Record<string, FormItemComponent> {
    return {
      ...this.formFieldMap,
      "Group Name": this.groupNameField,
    };
  }

  /**
   * 필드명으로 FormItem 컴포넌트 조회 (에러 검증용)
   * @throws Error - 유효하지 않은 필드명
   */
  private getFormField(fieldName: string): FormItemComponent {
    const field = this.formFieldMap[fieldName];
    if (!field) {
      throw new Error(
        `Unknown field name: ${fieldName}. Valid fields: ${Object.keys(this.formFieldMap).join(", ")}`,
      );
    }
    return field;
  }

  /**
   * 필드명으로 FormItem 컴포넌트 조회 (렌더링 검증용)
   * @throws Error - 유효하지 않은 필드명
   */
  private getField(fieldName: string): FormItemComponent {
    const field = this.allFieldMap[fieldName];
    if (!field) {
      throw new Error(
        `Unknown field name: ${fieldName}. Valid fields: ${Object.keys(this.allFieldMap).join(", ")}`,
      );
    }
    return field;
  }

  constructor(page: Page) {
    super(page);

    // FormItem 컴포넌트 초기화
    this.emailField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_EMAIL_FIELD,
    );
    this.passwordField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_PASSWORD_FIELD,
    );
    this.confirmPasswordField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_CONFIRM_PASSWORD_FIELD,
    );
    this.firstNameField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_FIRST_NAME_FIELD,
    );
    this.lastNameField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_LAST_NAME_FIELD,
    );
    this.groupNameField = new FormItemComponent(
      page,
      AUTH_SELECTOR.SIGNUP_GROUP_NAME_FIELD,
    );

    // Input 컴포넌트 초기화
    this.emailInput = new InputComponent(
      page,
      AUTH_SELECTOR.SIGNUP_EMAIL_INPUT,
    );
    this.passwordInput = new InputComponent(
      page,
      AUTH_SELECTOR.SIGNUP_PASSWORD_INPUT,
    );
    this.confirmPasswordInput = new InputComponent(
      page,
      AUTH_SELECTOR.SIGNUP_CONFIRM_PASSWORD_INPUT,
    );
    this.firstNameInput = new InputComponent(
      page,
      AUTH_SELECTOR.SIGNUP_FIRST_NAME_INPUT,
    );
    this.lastNameInput = new InputComponent(
      page,
      AUTH_SELECTOR.SIGNUP_LAST_NAME_INPUT,
    );

    // Dropdown 컴포넌트 초기화
    this.groupNameDropdown = new DropdownComponent(
      page,
      AUTH_SELECTOR.SIGNUP_GROUP_NAME_FIELD,
    );

    // Button 컴포넌트 초기화
    this.submitButton = new ButtonComponent(
      page,
      AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON,
    );
    this.goToLoginButton = new ButtonComponent(
      page,
      AUTH_SELECTOR.SIGNUP_GO_TO_LOGIN_BUTTON,
    );

    // Link 컴포넌트 초기화
    this.loginLink = new LinkComponent(page, AUTH_SELECTOR.SIGNUP_LOGIN_LINK);
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return AUTH_SELECTOR.SIGNUP_HEADER;
  }

  protected get basePath(): string {
    return "/signup";
  }

  // ============================================
  // Navigation Override
  // ============================================

  /**
   * 회원가입 페이지로 이동
   * networkidle 대신 페이지 헤더가 보일 때까지 대기 (더 안정적)
   */
  async goto(): Promise<void> {
    await this.page.goto(this.basePath);
    await this.pageHeader.waitFor({ state: "visible" });
  }

  // ============================================
  // Actions - Field Input
  // ============================================

  /**
   * Email 필드 입력
   * @param value - 입력할 이메일 값
   */
  async fillEmail(value: string): Promise<void> {
    await this.emailInput.fill(value);
  }

  /**
   * Password 필드 입력
   * @param value - 입력할 비밀번호 값
   */
  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  /**
   * Confirm Password 필드 입력
   * @param value - 입력할 비밀번호 확인 값
   */
  async fillConfirmPassword(value: string): Promise<void> {
    await this.confirmPasswordInput.fill(value);
  }

  /**
   * First Name 필드 입력
   * @param value - 입력할 이름 값
   */
  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.fill(value);
  }

  /**
   * Last Name 필드 입력
   * @param value - 입력할 성 값
   */
  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  /**
   * 필드명으로 값 입력
   * @param fieldName - 필드명 (Email, Password, Confirm Password, First Name, Last Name)
   * @param value - 입력할 값
   */
  async fillField(fieldName: string, value: string): Promise<void> {
    const input = this.inputFieldMap[fieldName];
    if (!input) {
      throw new Error(
        `Unknown field name: ${fieldName}. Valid fields: ${Object.keys(this.inputFieldMap).join(", ")}`,
      );
    }
    await input.fill(value);
  }

  /**
   * DataTable로 여러 필드 한번에 입력
   * @param data - { field, value } 형태의 배열
   */
  async fillFields(
    data: Array<{ field: string; value: string }>,
  ): Promise<void> {
    for (const row of data) {
      await this.fillField(row.field, row.value);
    }
  }

  // ============================================
  // Actions - Form Submit
  // ============================================

  /**
   * 회원가입 버튼 클릭
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * 로그인 링크 클릭
   */
  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  // ============================================
  // Actions - 회원가입 성공 후
  // ============================================

  /**
   * 로그인 페이지로 이동 버튼 클릭 (회원가입 성공 후)
   */
  async clickGoToLogin(): Promise<void> {
    await this.goToLoginButton.click();
  }

  // ============================================
  // Assertions
  // ============================================

  /**
   * 회원가입 페이지에 있는지 확인
   */
  async assertOnSignupPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/signup/);
  }

  /**
   * 특정 필드에 에러 메시지가 표시되는지 확인
   * @param fieldName - 필드명 (Email, Password, Confirm Password, First Name, Last Name)
   * @param expectedMessage - 기대하는 에러 메시지
   */
  async assertFieldError(
    fieldName: string,
    expectedMessage: string,
  ): Promise<void> {
    await this.getFormField(fieldName).assertErrorMessage(expectedMessage);
  }

  /**
   * 특정 필드에 에러 메시지가 없는지 확인
   * @param fieldName - 필드명 (Email, Password, Confirm Password, First Name, Last Name)
   */
  async assertFieldNoError(fieldName: string): Promise<void> {
    await this.getFormField(fieldName).assertNoError();
  }

  /**
   * 회원가입 버튼이 비활성화 상태인지 확인
   */
  async assertSubmitButtonDisabled(): Promise<void> {
    await this.submitButton.assertDisabled();
  }

  // ============================================
  // Assertions - 회원가입 성공
  // ============================================

  /**
   * 회원가입 성공 UI가 표시되는지 확인
   */
  async assertSignupSuccess(): Promise<void> {
    await expect(
      this.page.locator(testId(AUTH_SELECTOR.SIGNUP_SUCCESS_CONTAINER)),
    ).toBeVisible();
  }

  /**
   * 로그인 페이지로 이동 버튼이 표시되는지 확인 (회원가입 성공 후)
   */
  async assertGoToLoginButtonVisible(): Promise<void> {
    await this.goToLoginButton.assertVisible();
  }

  // ============================================
  // Actions & Assertions - maxLength 검증
  // ============================================

  /**
   * First Name 필드에 지정된 길이의 문자열 입력 시도
   * @param length - 입력 시도할 문자열 길이
   */
  async typeFirstNameWithLength(length: number): Promise<void> {
    await this.firstNameInput.fill(this.generateRandomText(length));
  }

  /**
   * Last Name 필드에 지정된 길이의 문자열 입력 시도
   * @param length - 입력 시도할 문자열 길이
   */
  async typeLastNameWithLength(length: number): Promise<void> {
    await this.lastNameInput.fill(this.generateRandomText(length));
  }

  /**
   * First Name 필드의 입력값 길이 검증
   * @param expectedLength - 기대하는 문자열 길이
   */
  async assertFirstNameLength(expectedLength: number): Promise<void> {
    const value = await this.firstNameInput.getValue();
    expect(value.length).toBe(expectedLength);
  }

  /**
   * Last Name 필드의 입력값 길이 검증
   * @param expectedLength - 기대하는 문자열 길이
   */
  async assertLastNameLength(expectedLength: number): Promise<void> {
    const value = await this.lastNameInput.getValue();
    expect(value.length).toBe(expectedLength);
  }

  // ============================================
  // Assertions - UI 렌더링 검증
  // ============================================

  /**
   * 특정 필드가 표시되는지 확인
   * @param fieldName - 필드명 (Email, Password, Confirm Password, First Name, Last Name, Group Name)
   */
  async assertFieldVisible(fieldName: string): Promise<void> {
    await this.getField(fieldName).assertVisible();
  }

  /**
   * 여러 필드가 표시되는지 확인
   * @param fieldNames - 필드명 배열
   */
  async assertFieldsVisible(fieldNames: string[]): Promise<void> {
    for (const fieldName of fieldNames) {
      await this.assertFieldVisible(fieldName);
    }
  }

  /**
   * 회원가입 버튼이 표시되는지 확인
   */
  async assertSubmitButtonVisible(): Promise<void> {
    await this.submitButton.assertVisible();
  }

  /**
   * 로그인 링크가 표시되는지 확인
   */
  async assertLoginLinkVisible(): Promise<void> {
    await this.loginLink.assertVisible();
  }
}
