import fs from "node:fs";
import path from "node:path";
import { chromium, type FullConfig } from "@playwright/test";

import { TEST_USERS } from "../src/shared/constants/auth.constant";

/**
 * Global Setup for Playwright Tests
 *
 * 테스트 실행 전 1회만 실행되어 인증 상태를 저장합니다.
 * 저장된 storageState는 모든 테스트에서 재사용되어 인증 시간을 절약합니다.
 *
 * 지원하는 사용자 타입:
 * - user: 일반 사용자 (tests/.auth/user.json)
 * - admin: 관리자 (tests/.auth/admin.json)
 */

const AUTH_DIR = path.join(__dirname, ".auth");
const DEFAULT_BASE_URL = "http://localhost:3000";

// 사용자 타입별 storageState 파일 경로
export const STORAGE_STATE_PATHS = {
  user: path.join(AUTH_DIR, "user.json"),
  admin: path.join(AUTH_DIR, "admin.json"),
} as const;

/**
 * CSRF 토큰 획득
 */
async function getCSRFToken(
  baseURL: string,
  request: ReturnType<typeof chromium.launch> extends Promise<infer T>
    ? T extends { newContext: () => Promise<infer C> }
      ? C extends { request: infer R }
        ? R
        : never
      : never
    : never,
): Promise<string> {
  const response = await request.get(`${baseURL}/api/auth/csrf`);
  const data = await response.json();
  return data.csrfToken ?? "";
}

/**
 * 특정 사용자로 인증하고 storageState 저장
 */
async function authenticateAndSave(
  baseURL: string,
  userType: keyof typeof TEST_USERS,
  storagePath: string,
): Promise<void> {
  const user = TEST_USERS[userType];
  if (!user) {
    throw new Error(`Unknown user type: ${userType}`);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // CSRF 토큰 획득
    const csrfToken = await getCSRFToken(baseURL, page.request);

    // NextAuth Credentials 로그인
    const response = await page.request.post(
      `${baseURL}/api/auth/callback/credentials`,
      {
        form: {
          username: user.preferred_username,
          password: user.preferred_username,
          csrfToken,
          json: "true",
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Authentication failed for ${userType}: ${response.status()}`,
      );
    }

    // 세션 검증
    const sessionResponse = await page.request.get(
      `${baseURL}/api/auth/session`,
    );
    const session = await sessionResponse.json();

    if (!session?.user) {
      throw new Error(`Session not created for ${userType}`);
    }

    // storageState 저장 (쿠키, localStorage 등)
    await context.storageState({ path: storagePath });

    console.log(`  ✅ ${userType} 인증 완료 → ${path.basename(storagePath)}`);
  } finally {
    await browser.close();
  }
}

/**
 * Global Setup Entry Point
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use?.baseURL ??
    process.env.BASE_URL ??
    DEFAULT_BASE_URL;

  console.log("\n🔐 인증 상태 초기화 시작...");
  console.log(`  Base URL: ${baseURL}`);

  // .auth 디렉토리 생성
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    console.log(`  📁 디렉토리 생성: ${AUTH_DIR}`);
  }

  try {
    // 일반 사용자 인증
    await authenticateAndSave(baseURL, "user", STORAGE_STATE_PATHS.user);

    // 관리자 인증
    await authenticateAndSave(baseURL, "admin", STORAGE_STATE_PATHS.admin);

    console.log("✅ 인증 상태 초기화 완료\n");
  } catch (error) {
    console.error("❌ 인증 초기화 실패:", error);
    throw error;
  }
}

export default globalSetup;
