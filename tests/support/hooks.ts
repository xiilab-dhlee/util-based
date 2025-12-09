import { createBdd } from "playwright-bdd";

import { authenticate } from "./auth.helper";

const { Before, After, BeforeAll, AfterAll } = createBdd();

/**
 * Hooks - 테스트 실행 전후에 실행되는 공통 로직
 *
 * NextAuth CredentialsProvider를 통해 실제 로그인을 수행합니다.
 * 개발 환경에서는 auth.config.ts의 CredentialsProvider가
 * 테스트 사용자 인증을 처리합니다.
 */

// 모든 테스트 시작 전 한 번만 실행
BeforeAll(async () => {
  // console.log("🚀 테스트 스위트 시작");
});

// 모든 테스트 종료 후 한 번만 실행
AfterAll(async () => {
  // console.log("✅ 테스트 스위트 완료");
});

// 각 시나리오 실행 전
Before(async ({ $testInfo }) => {
  console.log(`\n📝 시나리오 시작: ${$testInfo.title}`);
});

// 각 시나리오 실행 후
After(async ({ page, $testInfo }) => {
  // 테스트 실패 시 추가 디버깅 정보 수집
  if ($testInfo.status !== $testInfo.expectedStatus) {
    console.log(`❌ 시나리오 실패: ${$testInfo.title}`);

    // 현재 URL 로깅
    if (page) {
      console.log(`Current URL: ${page.url()}`);

      // 콘솔 로그 수집
      page.on("console", (msg) => {
        console.log(`Browser Console: ${msg.text()}`);
      });
    }
  } else {
    console.log(`✅ 시나리오 성공: ${$testInfo.title}`);
  }
});

// ============================================
// 테스트 분류별 Hook
// ============================================

/**
 * 스모크 테스트 (Smoke Test)
 *
 * 시스템의 핵심 기능이 정상 동작하는지 빠르게 검증
 * - 페이지 로딩 여부
 * - 기본 UI 요소 표시 여부
 * - 필수 기능의 동작 여부
 *
 * 배포 직후 "시스템이 살아있는가?"를 확인하는 용도
 * 실패 시 시스템 자체에 심각한 문제가 있음을 의미
 *
 * @example
 * @smoke
 * Scenario: 워크로드 목록 페이지 진입 시 기본 UI 표시
 */
Before({ tags: "@smoke" }, async () => {
  console.log("🔥 Smoke 테스트 실행");
});

/**
 * 회귀 테스트 (Regression Test)
 *
 * 기존 기능이 새로운 변경사항에 의해 영향받지 않았는지 검증
 * - 데이터 유효성 검증
 * - 복잡한 비즈니스 로직 검증
 * - 다양한 상태/조건 조합 테스트
 *
 * 코드 변경 후 기존 기능의 정상 동작을 확인하는 용도
 * 실패 시 특정 기능에 회귀(regression) 버그가 발생했음을 의미
 *
 * @example
 * @regression
 * Scenario: 워크로드 데이터 유효성 검증
 */
Before({ tags: "@regression" }, async () => {
  console.log("🔄 Regression 테스트 실행");
});

/**
 * 인증이 필요한 테스트를 위한 Hook
 * NextAuth CredentialsProvider API를 호출하여 실제 세션 생성
 */
Before({ tags: "@authenticated" }, async ({ page }) => {
  await authenticate(page, "admin");
});

/**
 * 일반 사용자로 인증이 필요한 테스트
 */
Before({ tags: "@authenticated-user" }, async ({ page }) => {
  await authenticate(page, "user");
});

// 특정 태그의 테스트 스킵
Before({ tags: "@skip" }, async () => "skipped");
