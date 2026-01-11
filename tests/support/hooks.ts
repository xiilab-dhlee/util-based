import { allure } from "allure-playwright";
import { createBdd } from "playwright-bdd";

import { test } from "../fixtures";
import { setupAllMocks } from "./mocks";

const { Before, After, BeforeAll, AfterAll, AfterStep } = createBdd(test);

// ============================================
// 성능 분석 설정
// ============================================

/** 느린 테스트 기준 (평균 대비 배율) - 2배 이상이면 느린 테스트 */
const SLOW_TEST_RATIO = 2;

/** 테스트별 실행 시간 저장 (세션 내) */
const testDurations: Map<string, number> = new Map();

// ============================================
// 전역 설정
// ============================================

BeforeAll(async () => {
  console.log("🚀 테스트 스위트 시작");
});

AfterAll(async () => {
  console.log("✅ 테스트 스위트 완료");

  // 성능 통계 출력
  if (testDurations.size > 0) {
    const durations = Array.from(testDurations.values());
    const average = durations.reduce((a, b) => a + b, 0) / durations.length;
    const threshold = average * SLOW_TEST_RATIO;

    const slowTests = Array.from(testDurations.entries())
      .filter(([, duration]) => duration >= threshold)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    if (slowTests.length > 0) {
      console.log(`\n🐢 느린 테스트 (>${Math.round(threshold)}ms):`);
      for (const [name, duration] of slowTests) {
        const ratio = (duration / average).toFixed(1);
        console.log(`   - ${name}: ${duration}ms (${ratio}x avg)`);
      }
    }
  }
});

// ============================================
// 시나리오 Hooks
// ============================================

Before(async ({ $testInfo }) => {
  console.log(`\n📝 ${$testInfo.title}`);
});

After(async ({ page, $testInfo }) => {
  const duration = $testInfo.duration;
  const testName = $testInfo.title;

  // 성능 데이터 수집 (스킵되지 않은 테스트만)
  if ($testInfo.status !== "skipped" && duration > 0) {
    testDurations.set(testName, duration);

    // Allure에 시간 라벨 추가
    allure.label("duration_ms", String(duration));

    // 현재까지 평균 계산하여 느린 테스트 라벨링
    const currentDurations = Array.from(testDurations.values());
    if (currentDurations.length >= 3) {
      const average =
        currentDurations.reduce((a, b) => a + b, 0) / currentDurations.length;
      const threshold = average * SLOW_TEST_RATIO;

      if (duration >= threshold) {
        const ratio = (duration / average).toFixed(1);
        allure.label("slow_test", "true");
        allure.label("slow_ratio", ratio);
        allure.parameter("Performance", `🐢 Slow (${ratio}x average)`);
      }
    }
  }

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
// Mock 설정 Hooks
// ============================================

/**
 * 모든 테스트 전에 API Mock 설정
 *
 * - 인증 쿠키는 storageState로 Playwright가 자동 관리
 * - Mock은 테스트 시작 전 자동으로 설정됨
 * - edge-case 테스트는 Given Step에서 특정 엔드포인트를 override
 *
 * Playwright route 우선순위:
 * - 나중에 등록된 route가 먼저 실행됨
 * - edge-case Given Step의 override가 setupAllMocks보다 우선
 */
Before(async ({ page, testMode }) => {
  if (testMode === "mock") {
    await setupAllMocks(page);
  }
});

/**
 * 비인증 테스트 - 쿠키 제거
 */
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

Before({ tags: "@skip" }, async ({ $testInfo }) => {
  $testInfo.skip();
});

Before({ tags: "@skip-ci" }, async ({ $testInfo }) => {
  if (process.env.CI) {
    $testInfo.skip();
  }
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
 * - "표시된다" (페이지 이동 결과 확인)
 *
 * 제외 대상:
 * - "선택되어 있다" (상태 확인, UI 행동 아님)
 * - "설정된" (과거 분사, 상태 확인)
 */
const UI_ACTION_PATTERN =
  /(클릭|입력|설정)한다|(클릭|이동|선택)하여|(표시|해제)된다|사라진다|이동한다$/;

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
 *   When 이전 페이지 버튼을 클릭한다  <- 스크린샷 캡처 (클릭)
 */
AfterStep(
  { tags: "@interaction or @edge-case" },
  async ({ page, $testInfo, $step }) => {
    const isUiAction = UI_ACTION_PATTERN.test($step.title);

    if (isUiAction) {
      await page.waitForTimeout(200);

      const screenshot = await page.screenshot();
      // 파일명 안전하게 처리: 특수문자 제거, 길이 제한
      const safeTitle = $step.title
        .slice(0, 40)
        .replace(/["""'']/g, "")
        .replace(/[^a-zA-Z0-9가-힣\s]/g, "_");
      const timestamp = Date.now();

      await $testInfo.attach(`${safeTitle}_${timestamp}.png`, {
        body: screenshot,
        contentType: "image/png",
      });
    }
  },
);
