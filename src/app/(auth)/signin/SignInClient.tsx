"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect } from "react";

/** 테스트 환경에서는 auth-provider.tsx가 자동 로그인 처리 */
const isTestAuth = process.env.TEST_AUTH_ENABLE === "true";

/**
 * Keycloak 자동 로그인 컴포넌트
 *
 * - Keycloak 프로바이더가 설정되어 있으면 자동으로 로그인 페이지로 리다이렉트
 * - 테스트 환경에서는 동작하지 않음 (auth-provider에서 처리)
 */
export default function SignInClient() {
  useEffect(() => {
    // 테스트 환경에서는 자동 로그인 처리
    if (isTestAuth) return;
    // Keycloak 프로바이더가 설정되어 있으면 자동으로 로그인 페이지로 리다이렉트
    const initKeycloakLogin = async () => {
      try {
        const providers = await getProviders();
        if (providers?.keycloak) {
          signIn("keycloak");
        }
      } catch (error) {
        console.error("Failed to get auth providers:", error);
      }
    };

    initKeycloakLogin();
  }, []);

  return null;
}
