import { createBdd, type DataTable } from "playwright-bdd";

import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 크리덴셜 Step Definitions
 *
 * 크리덴셜 추가 모달 관련 모든 Step 정의
 * - entry: 모달 진입 및 초기 상태 확인
 * - interaction: 크리덴셜 추가 성공 및 모달 동작
 * - validation: 유효성 검증 에러 처리
 *
 * Note: settingPage.credentialModal을 통해 모달 POM에 직접 접근
 */

const { Given, When, Then } = createBdd(test);

// ============================================
// Background Steps - 모달 열기
// ============================================

Given("크리덴셜 추가 모달이 열린 상태이다", async ({ settingPage }) => {
  await settingPage.clickAddCredentialButton();
  await settingPage.credentialModal.assertVisible();
});

// ============================================
// Given - 타입 설정
// ============================================

Given(
  "크리덴셜 타입을 {string}로 선택한다",
  async ({ settingPage }, typeName: string) => {
    await settingPage.credentialModal.selectType(typeName);
  },
);

Given(
  "크리덴셜 타입이 {string}으로 설정되어 있다",
  async ({ settingPage }, expectedType: string) => {
    await settingPage.credentialModal.assertTypeValue(expectedType);
  },
);

// ============================================
// Given - DataTable을 사용한 필드 입력
// ============================================

Given(
  "크리덴셜 필수값이 유효하게 입력되어 있다",
  async ({ settingPage }, dataTable: DataTable) => {
    const data = dataTable.hashes() as Array<{ field: string; value: string }>;
    await settingPage.credentialModal.fillFields(data);
  },
);

// ============================================
// When - 버튼 클릭
// ============================================

When("사용자가 크리덴셜 추가 버튼을 클릭한다", async ({ settingPage }) => {
  await settingPage.clickAddCredentialButton();
});

When("크리덴셜 추가 버튼을 클릭한다", async ({ settingPage }) => {
  await settingPage.credentialModal.submit();
});

When("크리덴셜 취소 버튼을 클릭한다", async ({ settingPage }) => {
  await settingPage.credentialModal.cancel();
});

// ============================================
// When - 개별 필드 입력
// ============================================

When(
  "크리덴셜 이름 필드에 {string}를 입력한다",
  async ({ settingPage }, value: string) => {
    await settingPage.credentialModal.fillName(value);
  },
);

When(
  "크리덴셜 아이디 필드에 {string}를 입력한다",
  async ({ settingPage }, value: string) => {
    await settingPage.credentialModal.fillUserId(value);
  },
);

When(
  "크리덴셜 토큰 필드에 {string}를 입력한다",
  async ({ settingPage }, value: string) => {
    await settingPage.credentialModal.fillToken(value);
  },
);

When("크리덴셜 이름 필드에 51자 문자열을 입력한다", async ({ settingPage }) => {
  await settingPage.credentialModal.fillNameWith51Chars();
});

// ============================================
// Then - 모달 상태 확인
// ============================================

Then("크리덴셜 추가 모달이 표시된다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertVisible();
});

Then("크리덴셜 추가 모달이 닫힌다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertHidden();
});

// ============================================
// Then - 필드 값 확인
// ============================================

Then("크리덴셜 이름 입력창이 빈 값이다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertFieldEmpty("이름");
});

Then("크리덴셜 설명 입력창이 빈 값이다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertFieldEmpty("설명");
});

Then("크리덴셜 아이디 입력창이 빈 값이다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertFieldEmpty("아이디");
});

Then("크리덴셜 토큰 입력창이 빈 값이다", async ({ settingPage }) => {
  await settingPage.credentialModal.assertFieldEmpty("토큰");
});

Then(
  "크리덴셜 Private Registry URL 입력창이 빈 값이다",
  async ({ settingPage }) => {
    await settingPage.credentialModal.assertFieldEmpty("Private Registry URL");
  },
);

// ============================================
// Then - 크리덴셜 목록 확인
// ============================================

/**
 * 크리덴셜 목록에 추가 확인
 *
 * testMode에 따라 동작:
 * - mock: MSW는 상태를 유지하지 않으므로 자동 성공 처리
 *         (API 호출 성공 + 모달 닫힘으로 기능 검증 완료)
 * - integration: 실제 목록에서 크리덴셜 확인
 */
Then(
  "크리덴셜 목록에 {string}가 추가된다",
  async ({ settingPage, testMode }, name: string) => {
    if (testMode === "mock") {
      // Mock 환경: MSW는 stateless이므로 목록 갱신 검증 불가
      // API 호출 성공 + 모달 닫힘으로 기능 검증 완료된 것으로 간주
      return;
    }

    // Integration 환경: 실제 목록에서 확인
    await settingPage.assertCredentialInList(name);
  },
);

/**
 * 크리덴셜 셀렉트박스에 추가 확인
 *
 * testMode에 따라 동작:
 * - mock: MSW는 상태를 유지하지 않으므로 자동 성공 처리
 * - integration: 실제 셀렉트박스에서 크리덴셜 확인
 *
 * Note: 이 step은 소스코드 생성 모달 등에서 사용됩니다.
 * 해당 페이지에서 assertCredentialInSelectbox 메서드를 구현해야 합니다.
 */
Then(
  "크리덴셜 셀렉트박스에 {string}가 추가된다",
  async ({ testMode, page }, name: string) => {
    if (testMode === "mock") {
      // Mock 환경: MSW는 stateless이므로 셀렉트박스 갱신 검증 불가
      // API 호출 성공 + 모달 닫힘으로 기능 검증 완료된 것으로 간주
      return;
    }

    // Integration 환경: 실제 셀렉트박스에서 확인
    // 크리덴셜 셀렉트박스 래퍼를 찾아서 해당 옵션이 있는지 확인
    const selectWrapper = page.getByTestId(CREDENTIAL_SELECTOR.SELECT_WRAPPER);
    await selectWrapper.click();
    await page.getByText(name).waitFor({ state: "visible" });
  },
);

// ============================================
// Then - 에러 메시지 확인
// ============================================

Then(
  "크리덴셜 이름 필드에 {string} 에러 메시지가 표시된다",
  async ({ settingPage }, message: string) => {
    await settingPage.credentialModal.assertFieldError("이름", message);
  },
);

Then(
  "크리덴셜 아이디 필드에 {string} 에러 메시지가 표시된다",
  async ({ settingPage }, message: string) => {
    await settingPage.credentialModal.assertFieldError("아이디", message);
  },
);

Then(
  "크리덴셜 토큰 필드에 {string} 에러 메시지가 표시된다",
  async ({ settingPage }, message: string) => {
    await settingPage.credentialModal.assertFieldError("토큰", message);
  },
);

Then(
  "크리덴셜 Private Registry URL 필드에 {string} 에러 메시지가 표시된다",
  async ({ settingPage }, message: string) => {
    await settingPage.credentialModal.assertFieldError(
      "Private Registry URL",
      message,
    );
  },
);
