"use client";

import { usePathname } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { useEffect } from "react";

/**
 * 테스트 환경 여부
 * 테스트 환경에서는 auth-provider.tsx가 자동 로그인을 처리하므로
 * 이 컴포넌트는 아무것도 하지 않습니다.
 */
const useTestAuth = process.env.NEXT_PUBLIC_TEST_AUTH_ENABLE === "true";

/** 자동 Keycloak 로그인을 스킵하는 경로 */
const EXCLUDED_PATHS = ["/license-main", "/createadmin"] as const;

/**
 * 로그인 페이지 클라이언트 컴포넌트 (Keycloak 환경 전용)
 *
 * - Keycloak 프로바이더가 있으면 자동으로 Keycloak 로그인 시작
 * - 테스트 환경에서는 아무것도 하지 않음 (auth-provider.tsx가 처리)
 */
export default function SignInClient() {
  const pathname = usePathname();

  useEffect(() => {
    // 테스트 환경: auth-provider.tsx에서 자동 로그인 처리
    if (useTestAuth) return;

    if (!pathname) return;
    if (EXCLUDED_PATHS.includes(pathname as (typeof EXCLUDED_PATHS)[number]))
      return;

    // 클라이언트에서 providers를 가져와서 Keycloak 로그인 시작
    getProviders().then((providers) => {
      if (providers?.keycloak) {
        signIn("keycloak");
      }
    });
  }, [pathname]);

  return null;
}
