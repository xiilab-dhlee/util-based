"use client";

import type { Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect, useRef } from "react";

import { AxiosService } from "@/shared/api/axios";

const isDev = process.env.NODE_ENV === "development";
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

/**
 * 세션 동기화 컴포넌트
 *
 * - 토큰 갱신 실패 시 NextAuth를 통해 재로그인
 * - 테스트 환경(TEST_AUTH_ENABLE=true)에서 세션이 없을 때 자동 로그인
 * - AxiosService에 세션 제공자 주입
 */
function SessionSync({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const hasAutoLoggedIn = useRef(false);
  const hasHandledError = useRef(false);

  // AxiosService에 세션 제공자 주입
  useEffect(() => {
    const axiosService = AxiosService.getInstance();

    // 세션 제공자 설정 - AxiosService가 동기적으로 세션에 접근 가능
    axiosService.setSessionProvider(() => session as Session | null);

    return () => {
      axiosService.clearSessionProvider();
    };
  }, [session]);

  // 토큰 갱신 실패 시 NextAuth를 통해 재로그인
  useEffect(() => {
    if (hasHandledError.current) return;

    // 세션에 에러가 있으면 (토큰 갱신 실패)
    if (session?.error === "RefreshAccessTokenError") {
      hasHandledError.current = true;

      if (isDev) {
        console.debug("[AuthProvider] ❌ 토큰 갱신 실패 감지 - 재로그인 필요");
      }

      // 환경에 맞는 프로바이더로 재로그인
      if (useTestAuth) {
        signIn("credentials", { redirect: false });
      } else {
        signIn("keycloak");
      }
    }
  }, [session?.error]);

  // 테스트 환경 자동 로그인 (CredentialsProvider 사용 시에만)
  useEffect(() => {
    // 테스트 환경이 아니면 자동 로그인 비활성화
    if (!useTestAuth) {
      return;
    }

    // 로딩 중이면 대기
    if (status === "loading") {
      return;
    }

    // 이미 자동 로그인 시도했으면 스킵 (중복 호출 방지)
    if (hasAutoLoggedIn.current) {
      return;
    }

    // 세션이 없으면 자동 로그인
    if (status === "unauthenticated") {
      hasAutoLoggedIn.current = true;
      if (isDev) {
        console.debug("[AuthProvider] 🔑 테스트 환경 자동 로그인 시도");
      }
      signIn("credentials", {
        redirect: false,
      });
    }
  }, [status]);

  return <>{children}</>;
}

/**
 * NextAuth SessionProvider 래퍼
 *
 * 클라이언트 컴포넌트에서 useSession 훅을 사용할 수 있도록 합니다.
 * 세션 정보는 자동으로 /api/auth/session 엔드포인트에서 가져옵니다.
 *
 * 테스트 환경(TEST_AUTH_ENABLE=true)에서는 세션이 없을 때
 * 자동으로 CredentialsProvider를 통해 로그인합니다.
 * AxiosService에 세션을 주입하여 API 요청 시 자동으로 토큰이 포함됩니다.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider
      // 세션 갱신 간격 (초 단위) - 5분마다 세션 상태 확인
      refetchInterval={5 * 60}
      // 윈도우 포커스 시 세션 갱신 비활성화 (중복 호출 방지)
      refetchOnWindowFocus={false}
    >
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}
