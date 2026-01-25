"use client";

import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect, useRef } from "react";

import { AxiosService } from "@/shared/api/axios";

// ============================================================================
// 환경 설정
// ============================================================================

const isDev = process.env.NODE_ENV === "development";
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

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
 * AxiosService에 세션 제공자, 갱신자 및 로그아웃 핸들러 주입
 * - 세션 제공자: API 요청 시 자동으로 토큰 포함
 * - 세션 갱신자: 401 에러 시 토큰 갱신 후 재시도
 * - 로그아웃 핸들러: 토큰 갱신 실패 시 세션 무효화 및 로그아웃
 */
function useAxiosSessionSync(session: Session | null) {
  const { update } = useSession();

  useEffect(() => {
    const axiosService = AxiosService.getInstance();
    axiosService.setSessionProvider(() => session);
    axiosService.setSessionUpdater(update);

    // 로그아웃 핸들러: 401 + 토큰 갱신 실패 시 호출됨
    const logoutHandler = async () => {
      authDebug("🔒 AxiosService에서 로그아웃 요청 → 세션 무효화");

      if (useTestAuth) {
        // 테스트 환경: credentials 프로바이더로 재로그인 시도
        await signIn("credentials", { redirect: false });
      } else {
        // 프로덕션 환경: Keycloak SSO 세션까지 종료 후 로그인 페이지로 이동
        await signOut({ callbackUrl: "/signin" });
      }
    };

    axiosService.setLogoutHandler(logoutHandler);

    return () => {
      axiosService.clearSessionProvider();
      axiosService.clearSessionUpdater();
      axiosService.clearLogoutHandler();
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
 * 세션 동기화 컴포넌트
 * - AxiosService에 세션 주입
 * - 토큰 갱신 실패 시 재로그인
 * - 테스트 환경 자동 로그인
 */
function SessionSync({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();

  useAxiosSessionSync(session);
  useTokenRefreshErrorHandler(session);
  useTestAutoLogin(status);

  // 세션 로딩 중에는 children을 렌더링하지 않음
  if (status === "loading") {
    return null; // 또는 로딩 스피너
  }

  return <>{children}</>;
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
