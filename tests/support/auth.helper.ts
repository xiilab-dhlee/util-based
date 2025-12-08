import type { BrowserContext, Page } from "@playwright/test";

import {
  TEST_USERS,
  type TestUser,
} from "../../src/shared/constants/auth.constant";

/**
 * 테스트용 인증 헬퍼
 *
 * NextAuth CredentialsProvider를 통해 실제 로그인을 수행합니다.
 * 개발 환경에서는 auth.config.ts의 CredentialsProvider가
 * 테스트 사용자 인증을 처리합니다.
 *
 * 사용자 정보는 src/shared/constants/auth.constant.ts에서 중앙 관리됩니다.
 */

const NEXTAUTH_SESSION_COOKIE = "next-auth.session-token";
const DEFAULT_BASE_URL = "http://localhost:3000";

/**
 * CSRF 토큰 가져오기
 */
async function getCSRFToken(page: Page, baseURL: string): Promise<string> {
  const response = await page.request.get(`${baseURL}/api/auth/csrf`);
  const data = await response.json();
  return data.csrfToken ?? "";
}

/**
 * 특정 역할을 가진 사용자로 로그인
 * NextAuth CredentialsProvider API를 호출하여 실제 세션 생성
 */
export async function loginAs(
  context: BrowserContext,
  userType: keyof typeof TEST_USERS = "admin",
  baseURL: string = DEFAULT_BASE_URL,
): Promise<void> {
  const user = TEST_USERS[userType];
  if (!user) {
    throw new Error(`Unknown user type: ${userType}`);
  }

  const page = await context.newPage();

  try {
    const csrfToken = await getCSRFToken(page, baseURL);

    await page.request.post(`${baseURL}/api/auth/callback/credentials`, {
      form: {
        username: user.preferred_username,
        password: user.preferred_username,
        csrfToken,
        json: "true",
      },
    });
  } finally {
    await page.close();
  }
}

// 인증 헬퍼 함수
export async function authenticate(
  page: Page,
  userType: "admin" | "user",
): Promise<void> {
  await loginAs(page.context(), userType);

  const authenticated = await isAuthenticated(page);
  if (authenticated) {
    console.log(`🔐 로그인 완료 (${userType})`);
  } else {
    throw new Error(`인증 실패: 세션이 생성되지 않았습니다 (${userType})`);
  }
}

/**
 * 페이지에서 인증 쿠키 확인
 */
export async function hasAuthCookie(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some((cookie) => cookie.name === NEXTAUTH_SESSION_COOKIE);
}

/**
 * 현재 세션 정보 가져오기
 */
export async function getSession(
  page: Page,
  baseURL: string = DEFAULT_BASE_URL,
): Promise<TestUser | null> {
  try {
    const response = await page.request.get(`${baseURL}/api/auth/session`);
    const session = await response.json();

    if (session?.user) {
      return {
        id: session.user.id ?? "",
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        preferred_username: session.user.preferred_username ?? "",
        roles: session.roles ?? [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 인증 상태 확인 (세션 API 호출)
 */
export async function isAuthenticated(
  page: Page,
  baseURL: string = DEFAULT_BASE_URL,
): Promise<boolean> {
  const session = await getSession(page, baseURL);
  return session !== null;
}

/**
 * 인증 쿠키 제거 (로그아웃 시뮬레이션)
 */
export async function clearAuthCookies(context: BrowserContext): Promise<void> {
  await context.clearCookies();
}
