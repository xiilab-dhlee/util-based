"use client";

import { usePathname } from "next/navigation";
import type { BuiltInProviderType } from "next-auth/providers/index";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

/**
 * Props for the SignInClient component
 */
interface SignInClientProps {
  /**
   * Available authentication providers
   * Can be a record mapping provider IDs to ClientSafeProvider objects,
   * null when no providers are available, or undefined during loading
   */
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | null
    | undefined;
}

/**
 * 로그인 페이지 클라이언트 컴포넌트
 * 1. 특정 경로가 아닌 경우 자동으로 Keycloak 로그인 페이지로 이동
 * 2. 실제 UI는 렌더링하지 않고 인증 로직만 처리
 */
export default function SignInClient({ providers }: SignInClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    // pathname이 null인 경우 early return
    if (!pathname) return;

    // 자동 로그인 처리를 위한 경로 제외 목록
    const excludedPaths = ["/license-main", "/createadmin"];

    // 제외 경로가 아니고, 사용 가능한 인증 제공자가 없는 경우 자동 로그인 시도
    const hasNoProviders =
      providers == null
        ? true
        : Array.isArray(providers)
          ? providers.length === 0
          : Object.keys(providers).length === 0;

    if (!excludedPaths.includes(pathname) && hasNoProviders) {
      signIn("keycloak");
    }
  }, [providers, pathname]);

  return null;
}
