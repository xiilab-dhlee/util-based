import { getProviders } from "next-auth/react";

import SignInClient from "@/app/(auth)/signin/SignInClient";

/**
 * 로그인 페이지 컴포넌트 (App Router 버전)
 *
 * 1. 이미 로그인된 사용자 리다이렉트는 middleware.ts에서 처리됨
 * 2. 특정 경로가 아닌 경우 자동으로 Keycloak 로그인 페이지로 이동
 * 3. 실제 UI는 렌더링하지 않고 인증 로직만 처리
 *
 * 참고: 인증된 사용자의 리다이렉트는 middleware.ts에서 처리됨
 */
export default async function SignIn() {
  // 사용 가능한 인증 제공자 목록 가져오기
  const providers = await getProviders();

  // 클라이언트 컴포넌트에 providers 전달
  return <SignInClient providers={providers} />;
}
