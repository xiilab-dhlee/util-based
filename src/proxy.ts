import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

import {
  ACCOUNT_ROLES,
  type AccountRole,
} from "@/shared/constants/core.constant";

// ============================================================================
// 상수
// ============================================================================

/** 인증 없이 접근 가능한 공개 경로 */
const PUBLIC_PATHS = ["/signin", "/signup", "/auth/error"] as const;

/** 프록시 처리를 건너뛰는 경로 접두사 */
const SKIP_PREFIXES = ["/_next", "/api"] as const;

const isDev = process.env.NODE_ENV === "development";

/**
 * 테스트 인증 모드 여부
 * - true: CredentialsProvider 사용 (auth-provider.tsx에서 자동 로그인)
 * - false: KeycloakProvider 사용 (로그인 페이지로 리다이렉트)
 */
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

// ============================================================================
// 타입
// ============================================================================

interface TokenWithRoles extends JWT {
  realm_access?: { roles?: AccountRole[] };
}

// ============================================================================
// 헬퍼 함수
// ============================================================================

/** 개발 환경 전용 디버깅 로그 */
function debugLog(message: string, data?: Record<string, unknown>): void {
  if (!isDev) return;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  console.debug(`[Proxy]${dataStr} ${message}`);
}

/** 정적 파일 확장자 패턴 (1~6자의 영문/숫자 확장자) */
const STATIC_FILE_EXTENSION_REGEX = /\.[A-Za-z0-9]{1,6}$/;

/**
 * 경로의 마지막 세그먼트가 파일 확장자를 가지는지 확인
 * - /favicon.ico → true
 * - /api/v1.0/resource → false (v1.0은 중간 세그먼트)
 * - /user/john.doe → false (확장자가 아닌 사용자명)
 */
function hasFileExtension(path: string): boolean {
  const lastSegment = path.split("/").pop() || "";
  return STATIC_FILE_EXTENSION_REGEX.test(lastSegment);
}

/** 프록시 처리를 건너뛸 경로인지 확인 (정적 파일, API 등) */
function shouldSkip(path: string): boolean {
  return (
    SKIP_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
    hasFileExtension(path)
  );
}

/** 공개 경로인지 확인 */
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );
}

/** NextAuth 토큰에서 역할 목록 추출 */
function extractRoles(token: TokenWithRoles | null): AccountRole[] {
  if (!token) return [];

  // auth.config.ts에서 세션 콜백으로 저장한 roles 우선 사용
  if (Array.isArray(token.roles)) {
    return token.roles;
  }

  // Keycloak realm_access에서 roles 추출 (fallback)
  if (Array.isArray(token.realm_access?.roles)) {
    return token.realm_access.roles;
  }

  return [];
}

/** 특정 역할을 보유하고 있는지 확인 */
function hasRole(roles: AccountRole[], requiredRole: AccountRole): boolean {
  return roles.includes(requiredRole);
}

/**
 * 토큰이 유효한지 확인
 * - 토큰이 존재하는지
 * - 토큰 갱신 에러가 없는지
 * - 만료 시간이 존재하는지
 * - 토큰이 만료되지 않았는지
 */
function isValidToken(token: TokenWithRoles | null): boolean {
  if (!token) return false;

  // 토큰 갱신 실패 에러가 있으면 무효
  if (token.error) {
    debugLog("⚠️ 토큰 에러 감지", { error: token.error });
    return false;
  }

  // 만료 시간이 없으면 무효
  const expiresAt = token.expires_at;
  if (!expiresAt) {
    debugLog("⚠️ 토큰 만료 시간 누락");
    return false;
  }

  // 만료 시간 확인
  const now = Math.floor(Date.now() / 1000);
  if (now >= expiresAt) {
    debugLog("⚠️ 토큰 만료됨", { expiresAt, now });
    return false;
  }

  return true;
}

/** 로그인 페이지로 리다이렉트 URL 생성 */
function createSignInRedirect(request: NextRequest, callbackPath: string): URL {
  const url = new URL("/signin", request.url);
  url.searchParams.set("callbackUrl", callbackPath);
  return url;
}

// ============================================================================
// 메인 프록시 함수
// ============================================================================

/**
 * App Router용 인증 프록시 (Next.js 16+)
 *
 * 처리 순서:
 * 1. 정적 파일/API 요청 스킵
 * 2. 미인증 사용자 처리
 *    - 테스트 환경(TEST_AUTH_ENABLE=true): 통과 (auth-provider에서 자동 로그인)
 *    - 프로덕션 환경: /signin 리다이렉트 (Keycloak 로그인)
 * 3. 인증된 사용자의 로그인 페이지 접근 → 홈으로 리다이렉트
 * 4. 역할 기반 접근 제어 (admin, user 경로)
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. 정적 파일 및 API 요청은 스킵
  if (shouldSkip(path)) {
    return NextResponse.next();
  }

  // 2. 세션 토큰 확인
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isPublic = isPublicPath(path);
  const hasValidToken = isValidToken(token as TokenWithRoles);

  // 3. 미인증 또는 만료된 토큰으로 보호된 경로 접근 시
  if (!hasValidToken && !isPublic) {
    // 테스트 환경: auth-provider.tsx에서 자동 로그인 처리하므로 리다이렉트 안함
    if (useTestAuth) {
      debugLog("🧪 테스트 환경 - 자동 로그인 대기", { from: path });
      return NextResponse.next();
    }

    // 프로덕션 환경: Keycloak 로그인 페이지로 리다이렉트
    debugLog("🔒 미인증/만료 접근 → /signin 리다이렉트", { from: path });
    return NextResponse.redirect(createSignInRedirect(request, path));
  }

  // 4. 유효한 토큰을 가진 사용자가 로그인 페이지 접근 시 → 홈으로
  if (hasValidToken && path === "/signin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. 역할 기반 접근 제어 - 유효한 토큰일 때만
  if (hasValidToken && token) {
    const roles = extractRoles(token as TokenWithRoles);

    // /admin 경로: ADMIN 또는 SUPER_ADMIN 필요
    if (
      path.startsWith("/admin") &&
      !hasRole(roles, ACCOUNT_ROLES.ADMIN) &&
      !hasRole(roles, ACCOUNT_ROLES.SUPER_ADMIN)
    ) {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // /user 경로: ADMIN, SUPER_ADMIN 또는 USER 필요
    if (path.startsWith("/user")) {
      const hasUserAccess =
        hasRole(roles, ACCOUNT_ROLES.ADMIN) ||
        hasRole(roles, ACCOUNT_ROLES.SUPER_ADMIN) ||
        hasRole(roles, ACCOUNT_ROLES.USER);

      if (!hasUserAccess) {
        debugLog("🔒 권한 없음 → /signin 리다이렉트", { from: path, roles });
        return NextResponse.redirect(createSignInRedirect(request, path));
      }
    }
  }

  return NextResponse.next();
}

// ============================================================================
// 설정
// ============================================================================

export const config = {
  /**
   * 미들웨어 실행 경로 (아래 경로 제외):
   * - api: API 라우트
   * - _next/static: 정적 파일
   * - _next/image: 이미지 최적화
   * - favicon.ico: 파비콘
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
