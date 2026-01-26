import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

import {
  ACCOUNT_ROLES,
  type AccountRole,
  USER_ROOT_PATH,
} from "@/shared/constants/core.constant";
import { MODE, ROUTES } from "@/shared/constants/routes.constant";

const PUBLIC_PATHS = [
  ROUTES.AUTH_SIGNIN,
  ROUTES.AUTH_SIGNUP,
  "/error",
] as const;

const SKIP_PREFIXES = ["/_next", "/api"] as const;

const isDev = process.env.NODE_ENV === "development";
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

interface TokenWithRoles extends JWT {
  realm_access?: { roles?: AccountRole[] };
  roles?: AccountRole[];
}

function debugLog(message: string, data?: Record<string, unknown>): void {
  if (!isDev) return;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  console.debug(`[Proxy]${dataStr} ${message}`);
}

const STATIC_FILE_EXTENSION_REGEX = /\.[A-Za-z0-9]{1,6}$/;

function hasFileExtension(path: string): boolean {
  const lastSegment = path.split("/").pop() || "";
  return STATIC_FILE_EXTENSION_REGEX.test(lastSegment);
}

function shouldSkip(path: string): boolean {
  return (
    SKIP_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
    hasFileExtension(path)
  );
}

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );
}

function extractRoles(token: TokenWithRoles | null): AccountRole[] {
  if (!token) return [];
  if (Array.isArray(token.roles)) return token.roles;
  if (Array.isArray(token.realm_access?.roles)) return token.realm_access.roles;
  return [];
}

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
  const url = new URL(ROUTES.AUTH_SIGNIN, request.url);
  url.searchParams.set("callbackUrl", callbackPath);
  return url;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (shouldSkip(path)) {
    return NextResponse.next();
  }

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
  if (hasValidToken && path === ROUTES.AUTH_SIGNIN) {
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
      return NextResponse.redirect(new URL(USER_ROOT_PATH, request.url));
    }

    // /user 경로: ADMIN, SUPER_ADMIN, USER 모두 접근 가능
    if (path.startsWith(MODE.USER)) {
      const hasUserAccess =
        hasRole(roles, ACCOUNT_ROLES.ADMIN) ||
        hasRole(roles, ACCOUNT_ROLES.SUPER_ADMIN) ||
        hasRole(roles, ACCOUNT_ROLES.USER);

      if (!hasUserAccess) {
        debugLog("🔒 권한 없음 → 로그인 페이지로 리다이렉트", {
          from: path,
          roles,
        });
        return NextResponse.redirect(createSignInRedirect(request, path));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
