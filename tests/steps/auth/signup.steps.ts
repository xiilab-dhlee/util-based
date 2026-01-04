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

Then("회원가입 페이지가 표시된다", async ({ signupPage }) => {
  await signupPage.assertPageVisible();
});

// ============================================
// Given - 필수값 미입력 시나리오
// ============================================

/**
 * 회원가입 필수값 입력 (통합 Step)
 *
 * DataTable에 포함된 필드만 입력합니다.
 * 특정 필드의 유효성을 검증하려면 해당 필드를 DataTable에서 제외하거나
 * 유효하지 않은 값을 포함시키면 됩니다.
 *
 * @example
 * Given 회원가입 필수값이 유효하게 입력되어 있다
 *   | field            | value            |
 *   | Email            | user1@xiilab.com |
 *   | Password         | xiirocks1!       |
 *   | Confirm Password | xiirocks1!       |
 *   | First Name       | 길동             |
 *   | Last Name        | 홍               |
 */
Given(
  "회원가입 필수값이 유효하게 입력되어 있다",
  async ({ signupPage }, dataTable) => {
    const data = dataTable.hashes() as Array<{ field: string; value: string }>;
    await signupPage.fillFields(data);
  },
);

// ============================================
// When - 버튼 클릭
// ============================================

When("회원가입 버튼을 클릭한다", async ({ signupPage }) => {
  await signupPage.clickSubmit();
});

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

Then(
  "Password 필드에 에러 메시지가 표시되지 않는다",
  async ({ signupPage }) => {
    await signupPage.assertFieldNoError("Password");
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

Then("회원가입 버튼이 표시된다", async ({ signupPage }) => {
  await signupPage.assertSubmitButtonVisible();
});

Then("로그인 페이지로 이동 버튼이 표시된다", async ({ signupPage }) => {
  await signupPage.assertGoToLoginButtonVisible();
});

// ============================================
// maxLength 회귀 방지 검증
// ============================================

When("First Name 필드에 26자를 입력하려고 시도한다", async ({ signupPage }) => {
  await signupPage.typeFirstNameWithLength(26);
});

When("Last Name 필드에 26자를 입력하려고 시도한다", async ({ signupPage }) => {
  await signupPage.typeLastNameWithLength(26);
});

Then("First Name 필드에는 25자까지만 표시된다", async ({ signupPage }) => {
  await signupPage.assertFirstNameLength(25);
});

Then("Last Name 필드에는 25자까지만 표시된다", async ({ signupPage }) => {
  await signupPage.assertLastNameLength(25);
});

// ============================================
// UI 렌더링 검증
// ============================================

Then("로그인하기 링크가 표시된다", async ({ signupPage }) => {
  await signupPage.assertLoginLinkVisible();
});

// ============================================
// Then - 필드 빈 값 검증
// ============================================

Then("Email 입력창이 빈 값이다", async ({ signupPage }) => {
  await signupPage.assertFieldEmpty("Email");
});

Then("Password 입력창이 빈 값이다", async ({ signupPage }) => {
  await signupPage.assertFieldEmpty("Password");
});

Then("Confirm Password 입력창이 빈 값이다", async ({ signupPage }) => {
  await signupPage.assertFieldEmpty("Confirm Password");
});

Then("First Name 입력창이 빈 값이다", async ({ signupPage }) => {
  await signupPage.assertFieldEmpty("First Name");
});

Then("Last Name 입력창이 빈 값이다", async ({ signupPage }) => {
  await signupPage.assertFieldEmpty("Last Name");
});

Then("Group Name 선택값이 비어있다", async ({ signupPage }) => {
  await signupPage.groupNameDropdown.assertEmpty();
});
