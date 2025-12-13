import { createBdd } from "playwright-bdd";

import { test } from "../fixtures";
import { authenticate, hasAuthCookie } from "./auth.helper";
import { setupAllMocks } from "./mocks";

const { Before, After, BeforeAll, AfterAll, AfterStep } = createBdd(test);

// ============================================
// 전역 설정
// ============================================

BeforeAll(async () => {
  console.log("🚀 테스트 스위트 시작");
});

AfterAll(async () => {
  console.log("✅ 테스트 스위트 완료");
});

// ============================================
// 시나리오 Hooks
// ============================================

let scenarioStartTime: number;

Before(async ({ $testInfo }) => {
  scenarioStartTime = Date.now();
  console.log(`\n📝 ${$testInfo.title}`);
});

After(async ({ page, $testInfo }) => {
  const duration = Date.now() - scenarioStartTime;

  if ($testInfo.status === "skipped") {
    // 스킵된 경우 사유 출력
    const skipReason =
      $testInfo.annotations.find((a) => a.type === "skip")?.description ??
      "사유 없음";
    console.log(`⏭️ (${duration}ms) - ${skipReason}`);
  } else if ($testInfo.status === $testInfo.expectedStatus) {
    console.log(`✅ (${duration}ms)`);
  } else {
    // 실패한 경우 상세 에러 정보 출력
    console.log(`❌ (${duration}ms)`);
    if (page) {
      console.log(`   URL: ${page.url()}`);
    }

    // 에러 메시지 출력
    if ($testInfo.error) {
      const errorMessage = $testInfo.error.message?.split("\n")[0] ?? "Unknown";
      console.log(`   에러: ${errorMessage}`);

      // 실패한 Step 정보가 있으면 출력
      if ($testInfo.error.stack) {
        const stepMatch = $testInfo.error.stack.match(/at .*steps.*\.ts:(\d+)/);
        if (stepMatch) {
          console.log(`   위치: steps line ${stepMatch[1]}`);
        }
      }
    }
  }
});

// ============================================
// 인증 Hooks
// ============================================

// 사용자 인증은 Given 스텝으로 처리 (common.steps.ts: "사용자가 로그인되어 있다")

Before({ tags: "@authenticated-admin" }, async ({ page }) => {
  // 1. 모든 API 모킹 설정 (페이지 이동 전에 먼저 설정)
  await setupAllMocks(page);
  // 2. storageState로 쿠키가 이미 로드됨 - API 호출 없이 쿠키 존재만 확인
  const hasCookie = await hasAuthCookie(page);
  if (!hasCookie) {
    await authenticate(page, "admin");
  }
});

Before({ tags: "@unauthenticated" }, async ({ page }) => {
  // 비인증 테스트도 모킹은 필요
  await setupAllMocks(page);
  await page.context().clearCookies();
});

// ============================================
// 테스트 분류 Hooks
// ============================================

Before({ tags: "@smoke" }, async () => {
  console.log("   🔥 [Smoke]");
});

Before({ tags: "@regression" }, async () => {
  console.log("   🔄 [Regression]");
});

Before({ tags: "@slow" }, async ({ $testInfo }) => {
  $testInfo.setTimeout(60000);
});

// ============================================
// 스킵 Hooks
// ============================================

Before({ tags: "@skip" }, async () => "skipped");

Before({ tags: "@skip-ci" }, async () => {
  if (process.env.CI) return "skipped";
});

// ============================================
// 스크린샷 Hooks
// ============================================

/**
 * UI 행동 패턴 정규식
 *
 * 스크린샷을 캡처할 사용자 행동 패턴:
 * - 행동 동사 + 종결어미 (-한다, -했다, -이다)
 *
 * 캡처 대상:
 * - "클릭한다", "입력한다", "설정한다" (능동적 행동)
 * - "클릭하여", "이동하여", "선택하여" (연결 동작)
 * - "이동한 상태이다" (Given에서 실제 네비게이션 수행)
 *
 * 제외 대상:
 * - "선택되어 있다" (상태 확인, UI 행동 아님)
 * - "표시된다" (검증, UI 행동 아님)
 * - "설정된" (과거 분사, 상태 확인)
 */
const UI_ACTION_PATTERN =
  /(클릭|입력|설정)한다|(클릭|이동|선택)하여|이동한 상태이다/;

/**
 * UI 행동 스텝 실행 후 스크린샷 캡처
 *
 * @interaction 태그가 있는 시나리오에서 UI 행동(클릭, 이동, 입력 등) 후
 * 자동으로 스크린샷을 찍어 리포트에 첨부합니다.
 *
 * When 키워드뿐 아니라 Given/And에서도 실제 UI 행동이면 캡처합니다.
 *
 * @example
 * // Feature 파일
 * @interaction
 * Scenario: 페이지네이션 테스트
 *   Given 페이지 2로 이동한 상태이다  <- 스크린샷 캡처 (이동)
 *   When 이전 페이지 버튼을 클릭한다  <- 스크린샷 캡처 (클릭)
 *   Then 현재 페이지가 1이다
 */
AfterStep({ tags: "@interaction" }, async ({ page, $testInfo, $step }) => {
  const isUiAction = UI_ACTION_PATTERN.test($step.title);

  if (isUiAction) {
    const screenshot = await page.screenshot();
    const stepTitle = $step.title.slice(0, 50);

    await $testInfo.attach(`[Action] ${stepTitle}`, {
      body: screenshot,
      contentType: "image/png",
    });
  }
});
