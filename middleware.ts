import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

interface TokenWithRoles extends JWT {
  realm_access?: { roles?: string[] };
  roles?: string[];
}

/** NextAuth 토큰에서 권한을 추출 */
const getRole = (tokenPayload: TokenWithRoles | null): string[] => {
  if (!tokenPayload) return [];

  // auth.config.ts에서 저장한 roles 사용
  if (Array.isArray(tokenPayload.roles)) {
    return tokenPayload.roles;
  }

  // Keycloak realm_access에서 roles 추출 (fallback)
  const roles = tokenPayload.realm_access?.roles;
  if (Array.isArray(roles)) {
    return roles;
  }

  return [];
};

/**
 * App Router용 인증 미들웨어
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 공개 경로 정의 (인증이 필요하지 않은 경로)
  const publicPaths = [
    "/signin",
    "/signup",
    "/auth/error",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/images",
    "/fonts",
  ];

  // 공개 경로인지 확인
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );

  // 세션 토큰 가져오기
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 인증되지 않은 사용자가 보호된 경로에 접근하는 경우
  if (!token && !isPublicPath) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // 인증된 사용자가 로그인 페이지에 접근하는 경우
  if (token && path === "/signin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 역할 기반 접근 제어
  if (token) {
    const roles = getRole(token);

    // 관리자 경로 접근 제어
    if (path.startsWith("/admin") && !roles.includes("ROLE_ADMIN")) {
      return NextResponse.redirect(new URL("/standard", request.url));
    }

    // 사용자 경로 접근 제어 (관리자와 일반 사용자 모두 접근 가능)
    if (
      path.startsWith("/user") &&
      !roles.includes("ROLE_ADMIN") &&
      !roles.includes("ROLE_USER")
    ) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 요청 경로에서 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
