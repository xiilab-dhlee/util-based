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
 *
 * @note globalSetup에서 storageState를 저장하여 인증 상태를 재사용합니다.
 *       개별 테스트에서는 세션 유효성만 검증하면 됩니다.
 */

const NEXTAUTH_SESSION_COOKIE = "next-auth.session-token";
const DEFAULT_BASE_URL = "http://localhost:3000";

// 세션 만료 허용 시간 (밀리초) - 세션이 이 시간 내에 만료되면 갱신
const SESSION_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5분

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

/**
 * 세션 유효성 검증
 * @returns "valid" | "expiring" | "invalid"
 */
export async function validateSession(
  page: Page,
  baseURL: string = DEFAULT_BASE_URL,
): Promise<"valid" | "expiring" | "invalid"> {
  try {
    const response = await page.request.get(`${baseURL}/api/auth/session`);

    if (!response.ok()) {
      return "invalid";
    }

    const session = await response.json();

    // 세션이 없는 경우
    if (!session?.user) {
      return "invalid";
    }

    // 세션 만료 시간 확인 (NextAuth는 expires 필드 제공)
    if (session.expires) {
      const expiresAt = new Date(session.expires).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // 이미 만료됨
      if (timeUntilExpiry <= 0) {
        return "invalid";
      }

      // 곧 만료됨 (갱신 필요)
      if (timeUntilExpiry < SESSION_REFRESH_THRESHOLD_MS) {
        return "expiring";
      }
    }

    return "valid";
  } catch {
    return "invalid";
  }
}

/**
 * 세션 갱신 (페이지 새로고침으로 세션 연장)
 *
 * NextAuth는 자동으로 세션을 갱신하므로,
 * 세션 API를 다시 호출하여 갱신을 트리거합니다.
 */
export async function refreshSession(
  page: Page,
  baseURL: string = DEFAULT_BASE_URL,
): Promise<boolean> {
  try {
    // NextAuth 세션 API 호출로 세션 갱신 트리거
    const response = await page.request.get(`${baseURL}/api/auth/session`, {
      headers: {
        // 세션 갱신 강제
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok()) {
      console.warn("⚠️ 세션 갱신 실패: API 응답 오류");
      return false;
    }

    const session = await response.json();

    if (session?.user) {
      console.log("✅ 세션 갱신 완료");
      return true;
    }

    return false;
  } catch (error) {
    console.warn("⚠️ 세션 갱신 실패:", error);
    return false;
  }
}

/**
 * 인증 헬퍼 함수
 *
 * storageState로 인증 상태가 이미 로드된 경우 세션 유효성만 검증합니다.
 * 세션이 만료되었거나 없는 경우 재인증을 수행합니다.
 */
export async function authenticate(
  page: Page,
  userType: "admin" | "user",
): Promise<void> {
  // 1. 기존 세션 유효성 확인
  const sessionStatus = await validateSession(page);

  if (sessionStatus === "valid") {
    console.log(`🔐 기존 세션 사용 (${userType})`);
    return;
  }

  if (sessionStatus === "expiring") {
    console.log(`🔄 세션 갱신 중 (${userType})...`);
    await refreshSession(page);
    return;
  }

  // 2. 세션이 없거나 만료된 경우 재인증
  console.log(`🔐 재인증 수행 (${userType})...`);
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
 * 세션 만료까지 남은 시간 (밀리초)
 * @returns 남은 시간 (밀리초), 만료된 경우 0, 정보 없으면 -1
 */
export async function getSessionTimeRemaining(
  page: Page,
  baseURL: string = DEFAULT_BASE_URL,
): Promise<number> {
  try {
    const response = await page.request.get(`${baseURL}/api/auth/session`);
    const session = await response.json();

    if (session?.expires) {
      const expiresAt = new Date(session.expires).getTime();
      const remaining = expiresAt - Date.now();
      return Math.max(0, remaining);
    }

    return -1; // 만료 정보 없음
  } catch {
    return -1;
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

/**
 * 인증 상태 확인 및 필요시 복구
 *
 * storageState 사용 시 테스트 시작 전에 호출하여
 * 인증 상태가 유효한지 확인하고 필요시 복구합니다.
 */
export async function ensureAuthenticated(
  page: Page,
  userType: "admin" | "user" = "user",
): Promise<void> {
  const status = await validateSession(page);

  switch (status) {
    case "valid":
      // 유효한 세션 - 아무것도 하지 않음
      break;
    case "expiring":
      // 곧 만료 - 갱신 시도
      await refreshSession(page);
      break;
    case "invalid":
      // 무효 - 재인증
      await authenticate(page, userType);
      break;
  }
}
