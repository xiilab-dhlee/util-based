import SignInClient from "@/app/(auth)/signin/SignInClient";

/**
 * 로그인 페이지 컴포넌트 (App Router 버전)
 *
 * - proxy.ts에서 미인증 사용자를 이 페이지로 리다이렉트
 * - SignInClient에서 Keycloak 로그인 자동 시작
 */
export default function SignIn() {
  return <SignInClient />;
}
