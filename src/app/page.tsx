import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/config/auth.config";
import {
  ACCOUNT_ROLES,
  ADMIN_ROOT_PATH,
  USER_ROOT_PATH,
} from "@/shared/constants/core.constant";

export const metadata = {
  title: "AstraGo",
};

/**
 * 홈페이지 - 권한에 따른 리다이렉트
 *
 * 인증 체크는 proxy.ts에서 처리되므로,
 * 여기서는 역할별 대시보드 라우팅만 담당합니다.
 *
 * 우선순위: ADMIN > USER (높은 권한 우선)
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userRoles = session?.roles ?? [];

  // 관리자는 관리자 대시보드로 (ADMIN 권한 우선)
  if (userRoles.includes(ACCOUNT_ROLES.ADMIN)) {
    redirect(ADMIN_ROOT_PATH);
  }

  // 사용자는 사용자 대시보드로
  if (userRoles.includes(ACCOUNT_ROLES.USER)) {
    redirect(USER_ROOT_PATH);
  }

  // 역할이 없는 사용자는 로그인 페이지로 (보안: 권한 없는 접근 차단)
  redirect("/signin");
}
