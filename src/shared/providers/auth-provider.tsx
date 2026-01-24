"use client";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect, useRef } from "react";

import { AxiosService } from "@/shared/api/axios";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useLogoutSync } from "@/shared/hooks/use-logout-sync";

// ============================================================================
// 환경 설정
// ============================================================================

const isDev = process.env.NODE_ENV === "development";
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

/** 인증 과정이 필요 없는 공개 경로 (세션 체크/토큰 갱신 생략) */
const PUBLIC_AUTH_PATHS = [
  ROUTES.AUTH_SIGNIN,
  ROUTES.AUTH_SIGNUP,
  ROUTES.AUTH_LICENSE,
  ROUTES.ERROR,
] as const;

/** 현재 경로가 공개 인증 경로인지 확인 */
function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

// ============================================================================
// 유틸리티
// ============================================================================

function authDebug(message: string): void {
  if (isDev) {
    console.debug(`[AuthProvider] ${message}`);
  }
}

// ============================================================================
// 커스텀 훅
// ============================================================================

/**
 * AxiosService에 세션 제공자 및 갱신자 주입
 * - 세션 제공자: API 요청 시 자동으로 토큰 포함
 * - 세션 갱신자: 401 에러 시 토큰 갱신 후 재시도
 */
function useAxiosSessionSync(session: Session | null) {
  const { update } = useSession();

  useEffect(() => {
    const axiosService = AxiosService.getInstance();
    axiosService.setSessionProvider(() => session);
    axiosService.setSessionUpdater(update);

    return () => {
      axiosService.clearSessionProvider();
      axiosService.clearSessionUpdater();
    };
  }, [session, update]);
}

/**
 * 토큰 갱신 실패 시 로그아웃 처리
 * - 세션 에러 감지 시 Keycloak SSO 세션까지 종료
 * - 세션 정상화 시 에러 핸들링 플래그 리셋
 */
function useTokenRefreshErrorHandler(session: Session | null) {
  const hasHandledError = useRef(false);

  useEffect(() => {
    // 세션 정상 → 플래그 리셋 (다음 에러 핸들링 가능)
    if (session && !session.error) {
      hasHandledError.current = false;
      return;
    }

    // 이미 처리됨 → 스킵
    if (hasHandledError.current) return;

    // 토큰 갱신 실패 → 로그아웃 (Keycloak SSO 세션까지 종료)
    if (session?.error === "RefreshAccessTokenError") {
      hasHandledError.current = true;
      authDebug("❌ 토큰 갱신 실패 → 로그아웃 후 재로그인 필요");

      // 테스트 환경: credentials 프로바이더로 재로그인
      // 프로덕션 환경: Keycloak SSO 세션까지 종료 후 로그인 페이지로 이동
      if (useTestAuth) {
        void signIn("credentials", { redirect: false });
      } else {
        void signOut({ callbackUrl: "/signin" });
      }
    }
  }, [session]);
}

/**
 * 테스트 환경 자동 로그인
 * TEST_AUTH_ENABLE=true일 때 세션이 없으면 자동으로 로그인
 */
function useTestAutoLogin(
  status: "loading" | "authenticated" | "unauthenticated",
) {
  const hasAutoLoggedIn = useRef(false);

  useEffect(() => {
    if (!useTestAuth) return;
    if (status === "loading") return;
    if (hasAutoLoggedIn.current) return;

    if (status === "unauthenticated") {
      hasAutoLoggedIn.current = true;
      authDebug("🔑 테스트 환경 자동 로그인 시도");
      void signIn("credentials", { redirect: false });
    }
  }, [status]);
}

// ============================================================================
// 컴포넌트
// ============================================================================

/**
 * 보호된 경로에서만 세션 동기화 수행
 * - AxiosService에 세션 주입
 * - 토큰 갱신 실패 시 재로그인
 * - 테스트 환경 자동 로그인
 */
function ProtectedSessionSync({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();

  useAxiosSessionSync(session);
  useTokenRefreshErrorHandler(session);
  useTestAutoLogin(status);
  useLogoutSync(); // 다중 탭 로그아웃 동기화

  // 세션 로딩 중에는 children을 렌더링하지 않음
  if (status === "loading") {
    return null; // 또는 로딩 스피너
  }

  return <>{children}</>;
}

/**
 * 세션 동기화 라우터
 * - 공개 경로(signin, signup 등): 인증 과정 없이 바로 렌더링
 * - 보호 경로: 세션 동기화 후 렌더링
 */
function SessionSync({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // 공개 경로에서는 인증 과정 없이 바로 렌더링
  if (isPublicAuthPath(pathname)) {
    return <>{children}</>;
  }

  // 보호 경로에서는 세션 동기화 수행
  return <ProtectedSessionSync>{children}</ProtectedSessionSync>;
}

/**
 * NextAuth SessionProvider 래퍼
 *
 * 클라이언트 컴포넌트에서 useSession 훅을 사용할 수 있도록 합니다.
 * AxiosService에 세션을 주입하여 API 요청 시 자동으로 토큰이 포함됩니다.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // 5분마다 세션 상태 확인
      refetchOnWindowFocus={false} // 윈도우 포커스 시 세션 갱신 비활성화
    >
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}
