"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

/** 테스트 환경에서는 auth-provider.tsx가 자동 로그인 처리 */
const isTestAuth = process.env.TEST_AUTH_ENABLE === "true";

/**
 * 로그인 페이지 컴포넌트
 *
 * - proxy.ts에서 미인증 사용자를 이 페이지로 리다이렉트
 * - Keycloak 프로바이더가 설정되어 있으면 자동으로 로그인 페이지로 리다이렉트
 * - 테스트 환경에서는 동작하지 않음 (auth-provider에서 처리)
 */
export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isTestAuth) return;

    const initKeycloakLogin = async () => {
      try {
        const providers = await getProviders();
        if (providers?.keycloak) {
          void signIn("keycloak");
        } else {
          setError("Keycloak provider가 설정되지 않았습니다.");
        }
      } catch (error) {
        console.error("Failed to get auth providers:", error);
        setError("인증 제공자를 불러오는데 실패했습니다.");
      }
    };

    initKeycloakLogin();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return null;
}
