import { createBdd } from "playwright-bdd";

import { test } from "../fixtures";
import { authenticate } from "./auth.helper";

const { Before, After, BeforeAll, AfterAll } = createBdd(test);

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

Before({ tags: "@authenticated-user" }, async ({ page }) => {
  await authenticate(page, "user");
});

Before({ tags: "@authenticated-admin" }, async ({ page }) => {
  await authenticate(page, "admin");
});

Before({ tags: "@unauthenticated" }, async ({ page }) => {
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
