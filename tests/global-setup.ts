import type { FullConfig } from "@playwright/test";

/**
 * Global Setup for Playwright Tests
 *
 * 테스트 실행 전 1회만 실행됩니다.
 *
 * 용도:
 * - 통합 테스트를 위한 테스트 데이터 생성 API 호출
 * - 테스트 환경 초기화
 *
 * 참고: 인증은 auth-provider.tsx에서 자동으로 처리됩니다.
 * (TEST_AUTH_ENABLE=true 환경에서 CredentialsProvider 사용)
 */

const DEFAULT_BASE_URL = "http://localhost:3000";

/**
 * Global Setup Entry Point
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use?.baseURL ??
    process.env.BASE_URL ??
    DEFAULT_BASE_URL;

  console.log("\n🚀 테스트 환경 초기화...");
  console.log(`  Base URL: ${baseURL}`);

  // TODO: 통합 테스트용 데이터 생성 API 호출
  // 예시:
  // await createTestWorkspace(baseURL);
  // await createTestUser(baseURL);

  console.log("✅ 테스트 환경 초기화 완료\n");
}

export default globalSetup;
