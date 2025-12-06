import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/config/auth.config";
import {
  ADMIN_ROOT_PATH,
  USER_ROOT_PATH,
} from "@/shared/constants/core.constant";

export const metadata = {
  title: "AstraGo",
};

/**
 * 홈페이지 - 권한에 따른 리다이렉트
 * 인증된 사용자는 권한에 따라 admin 또는 user 영역으로 이동
 *
 * 참고: 기본 인증 체크는 middleware.ts에서 처리되며,
 * 여기서는 역할별 대시보드 라우팅만 담당합니다.
 */
export default async function HomePage() {
  // NextAuth 세션 가져오기 (서버 컴포넌트)
  const session = await getServerSession(authOptions);

  // 세션에서 역할 정보 추출
  const userRoles = (session as { roles?: string[] })?.roles ?? [];

  // 관리자는 관리자 대시보드로
  if (userRoles.includes("ROLE_ADMIN") || userRoles.includes("admin")) {
    redirect(ADMIN_ROOT_PATH);
  }

  // 표준 사용자는 표준 대시보드로
  redirect(USER_ROOT_PATH);
}
