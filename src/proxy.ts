import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

import {
  ACCOUNT_ROLES,
  type AccountRole,
} from "@/shared/constants/core.constant";
import { MODE, ROUTES } from "@/shared/constants/routes.constant";

const PUBLIC_PATHS = [
  ROUTES.AUTH_SIGNIN,
  ROUTES.AUTH_SIGNUP,
  "/auth/error",
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

  if (!token && !isPublic) {
    if (useTestAuth) {
      debugLog("🧪 테스트 환경 - 자동 로그인 대기", { from: path });
      return NextResponse.next();
    }
    debugLog("🔒 미인증 접근 → 로그인 페이지로 리다이렉트", { from: path });
    return NextResponse.redirect(createSignInRedirect(request, path));
  }

  if (token && path === ROUTES.AUTH_SIGNIN) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    const roles = extractRoles(token);

    if (path.startsWith(MODE.ADMIN) && !hasRole(roles, ACCOUNT_ROLES.ADMIN)) {
      return NextResponse.redirect(new URL(MODE.USER, request.url));
    }

    if (path.startsWith(MODE.USER)) {
      const hasUserAccess =
        hasRole(roles, ACCOUNT_ROLES.ADMIN) ||
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
