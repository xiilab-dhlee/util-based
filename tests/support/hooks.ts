import { createBdd } from "playwright-bdd";

import { isAuthenticated, loginAs } from "./auth.helper";

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

// 특정 태그가 있는 시나리오에만 적용되는 Hook
Before({ tags: "@smoke" }, async () => {
  console.log("🔥 Smoke 테스트 실행");
});

/**
 * 인증이 필요한 테스트를 위한 Hook
 * NextAuth CredentialsProvider API를 호출하여 실제 세션 생성
 */
Before({ tags: "@authenticated" }, async ({ page }) => {
  // admin 사용자로 실제 로그인 수행
  await loginAs(page.context(), "admin");

  // 로그인 성공 확인
  const authenticated = await isAuthenticated(page);
  if (authenticated) {
    console.log("🔐 로그인 완료 (admin)");
  } else {
    console.warn("⚠️ 로그인 실패 - 세션이 생성되지 않았습니다");
  }
});

/**
 * 일반 사용자로 인증이 필요한 테스트
 */
Before({ tags: "@authenticated-user" }, async ({ page }) => {
  // user 사용자로 실제 로그인 수행
  await loginAs(page.context(), "user");

  // 로그인 성공 확인
  const authenticated = await isAuthenticated(page);
  if (authenticated) {
    console.log("🔐 로그인 완료 (user)");
  } else {
    console.warn("⚠️ 로그인 실패 - 세션이 생성되지 않았습니다");
  }
});

// 특정 태그의 테스트 스킵
Before({ tags: "@skip" }, async () => "skipped");
