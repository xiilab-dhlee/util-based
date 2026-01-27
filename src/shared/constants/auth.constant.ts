import { ROUTES } from "@/shared/constants/routes.constant";

/**
 * 인증이 필요 없는 공통 공개 경로
 * - proxy(서버)와 AuthProvider(클라이언트)에서 함께 사용
 * - 레이어별 특수 케이스가 있으면 이 리스트를 기반으로 확장
 */
export const PUBLIC_AUTH_PATHS = [
  ROUTES.AUTH_SIGNIN,
  ROUTES.AUTH_SIGNUP,
  ROUTES.AUTH_SIGNUP_ADMIN,
  ROUTES.AUTH_LICENSE,
  ROUTES.ERROR,
] as const;
