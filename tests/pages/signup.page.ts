import { expect, type Locator } from "@playwright/test";

import { AUTH_SELECTOR, testId } from "@/shared/constants/selector.constant";
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
  // Locators - Form Fields (FormItem 기반)
  // ============================================

  /** Email FormItem */
  get emailField(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_EMAIL_FIELD));
  }

  /** Email 입력 필드 (FormItem 내부 input) */
  get emailInput(): Locator {
    return this.emailField.locator("input");
  }

  /** Password FormItem */
  get passwordField(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_PASSWORD_FIELD));
  }

  /** Password 입력 필드 (FormItem 내부 input) */
  get passwordInput(): Locator {
    return this.passwordField.locator("input");
  }

  /** Confirm Password FormItem */
  get confirmPasswordField(): Locator {
    return this.page.locator(
      testId(AUTH_SELECTOR.SIGNUP_CONFIRM_PASSWORD_FIELD),
    );
  }

  /** Confirm Password 입력 필드 (FormItem 내부 input) */
  get confirmPasswordInput(): Locator {
    return this.confirmPasswordField.locator("input");
  }

  /** First Name FormItem */
  get firstNameField(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_FIRST_NAME_FIELD));
  }

  /** First Name 입력 필드 (FormItem 내부 input) */
  get firstNameInput(): Locator {
    return this.firstNameField.locator("input");
  }

  /** Last Name FormItem */
  get lastNameField(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_LAST_NAME_FIELD));
  }

  /** Last Name 입력 필드 (FormItem 내부 input) */
  get lastNameInput(): Locator {
    return this.lastNameField.locator("input");
  }

  /** Group Name 드롭다운 */
  get groupNameDropdown(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_GROUP_NAME));
  }

  /** 회원가입 버튼 */
  get submitButton(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON));
  }

  /** 로그인 페이지로 이동 버튼 (회원가입 성공 후) */
  get goToLoginButton(): Locator {
    return this.page.getByRole("button", { name: "로그인 페이지로 이동" });
  }

  /** 로그인 링크 */
  get loginLink(): Locator {
    return this.page.locator(testId(AUTH_SELECTOR.SIGNUP_LOGIN_LINK));
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
    const fieldMap: Record<string, () => Promise<void>> = {
      Email: () => this.fillEmail(value),
      Password: () => this.fillPassword(value),
      "Confirm Password": () => this.fillConfirmPassword(value),
      "First Name": () => this.fillFirstName(value),
      "Last Name": () => this.fillLastName(value),
    };

    const fillAction = fieldMap[fieldName];
    if (!fillAction) {
      throw new Error(`Unknown field name: ${fieldName}`);
    }
    await fillAction();
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
   * 로그인 페이지로 이동 버튼 클릭
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
    const fieldLocatorMap: Record<string, Locator> = {
      Email: this.emailField,
      Password: this.passwordField,
      "Confirm Password": this.confirmPasswordField,
      "First Name": this.firstNameField,
      "Last Name": this.lastNameField,
    };

    const fieldLocator = fieldLocatorMap[fieldName];
    if (!fieldLocator) {
      throw new Error(`Unknown field name: ${fieldName}`);
    }

    // FormItem 내에서 에러 메시지 검증
    const errorLocator = fieldLocator.getByText(expectedMessage);
    await expect(errorLocator).toBeVisible();
  }

  /**
   * 회원가입 버튼이 비활성화 상태인지 확인
   */
  async assertSubmitButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * 로그인 페이지로 이동 버튼이 표시되는지 확인
   */
  async assertGoToLoginButtonVisible(): Promise<void> {
    await expect(this.goToLoginButton).toBeVisible();
  }

  /**
   * 회원가입 성공 확인 (complete-signup 페이지로 이동)
   */
  async assertSignupSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/complete-signup/);
  }
}
