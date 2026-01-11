"use client";

import type { Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
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
 * AxiosService에 세션 제공자 주입
 * API 요청 시 자동으로 토큰이 포함되도록 함
 */
function useAxiosSessionSync(session: Session | null) {
  useEffect(() => {
    const axiosService = AxiosService.getInstance();
    axiosService.setSessionProvider(() => session);

    return () => {
      axiosService.clearSessionProvider();
    };
  }, [session]);
}

/**
 * 토큰 갱신 실패 시 자동 재로그인
 * - 세션 에러 감지 시 환경에 맞는 프로바이더로 재로그인
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

    // 토큰 갱신 실패 → 재로그인
    if (session?.error === "RefreshAccessTokenError") {
      hasHandledError.current = true;
      authDebug("❌ 토큰 갱신 실패 → 재로그인 시도");

      const provider = useTestAuth ? "credentials" : "keycloak";
      signIn(provider, { redirect: !useTestAuth });
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
      signIn("credentials", { redirect: false });
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
