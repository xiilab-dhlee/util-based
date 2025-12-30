import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 회원가입 Step Definitions
 *
 * signup.feature의 시나리오에 대응하는 Step 정의
 * - 필수값 미입력 검증
 * - 형식 오류 검증
 * - 성공 케이스
 */

const { Given, When, Then } = createBdd(test);

// ============================================
// Background Steps
// ============================================

Given("회원가입 페이지에 진입한다", async ({ signupPage }) => {
  await signupPage.goto();
});

// ============================================
// Given - 필수값 미입력 시나리오
// ============================================

/**
 * 특정 필드를 제외한 필수값 입력 (통합 Step)
 *
 * @example
 * Given Email을 제외한 필수값이 유효하게 입력되어 있다
 * Given Password를 제외한 필수값이 유효하게 입력되어 있다
 * Given Confirm Password를 제외한 필수값이 유효하게 입력되어 있다
 *
 * @param excludedField - 제외할 필드명 (문서화 목적, DataTable에서 실제 제외됨)
 * @param dataTable - 입력할 필드/값 쌍
 */
Given(
  /^(.+)를? 제외한 필수값이 유효하게 입력되어 있다$/,
  async ({ signupPage }, excludedField: string, dataTable) => {
    // excludedField: Feature 파일에서 문서화 목적으로 명시
    // 실제 제외 로직은 DataTable에서 해당 필드를 생략하여 처리
    void excludedField;
    const data = dataTable.hashes() as Array<{ field: string; value: string }>;
    await signupPage.fillFields(data);
  },
);

// ============================================
// When - 필드 입력
// ============================================

When(
  "Email 필드에 {string}을 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillEmail(value);
  },
);

When(
  "Password 필드에 {string}을 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillPassword(value);
  },
);

When(
  "Confirm Password 필드에 {string}을 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillConfirmPassword(value);
  },
);

When(
  "Confirm Password 필드에 {string}를 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillConfirmPassword(value);
  },
);

When(
  "First Name 필드에 {string}을 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillFirstName(value);
  },
);

When(
  "Last Name 필드에 {string}을 입력한다",
  async ({ signupPage }, value: string) => {
    await signupPage.fillLastName(value);
  },
);

// ============================================
// When - 버튼 클릭
// ============================================

When(
  /^"(회원가입|로그인 페이지로 이동)" 버튼을 클릭한다$/,
  async ({ signupPage }, buttonName: string) => {
    if (buttonName === "회원가입") {
      await signupPage.clickSubmit();
    } else if (buttonName === "로그인 페이지로 이동") {
      await signupPage.clickGoToLogin();
    }
  },
);

// ============================================
// Then - 에러 메시지 검증
// ============================================

Then(
  "Email 필드에 {string} 에러 메시지가 표시된다",
  async ({ signupPage }, expectedMessage: string) => {
    await signupPage.assertFieldError("Email", expectedMessage);
  },
);

Then(
  "Password 필드에 {string} 에러 메시지가 표시된다",
  async ({ signupPage }, expectedMessage: string) => {
    await signupPage.assertFieldError("Password", expectedMessage);
  },
);

Then(
  "Confirm Password 필드에 {string} 에러 메시지가 표시된다",
  async ({ signupPage }, expectedMessage: string) => {
    await signupPage.assertFieldError("Confirm Password", expectedMessage);
  },
);

Then(
  "First Name 필드에 {string} 에러 메시지가 표시된다",
  async ({ signupPage }, expectedMessage: string) => {
    await signupPage.assertFieldError("First Name", expectedMessage);
  },
);

Then(
  "Last Name 필드에 {string} 에러 메시지가 표시된다",
  async ({ signupPage }, expectedMessage: string) => {
    await signupPage.assertFieldError("Last Name", expectedMessage);
  },
);

// ============================================
// Then - 페이지 상태 검증
// ============================================

Then("회원가입 페이지에 유지된다", async ({ signupPage }) => {
  await signupPage.assertOnSignupPage();
});

// ============================================
// Then - 성공 케이스
// ============================================

Then("회원가입이 성공적으로 처리된다", async ({ signupPage }) => {
  await signupPage.assertSignupSuccess();
});

Then("{string} 버튼이 표시된다", async ({ signupPage }, buttonName: string) => {
  if (buttonName === "로그인 페이지로 이동") {
    await signupPage.assertGoToLoginButtonVisible();
  } else {
    throw new Error(`Unknown button for visibility check: ${buttonName}`);
  }
});
