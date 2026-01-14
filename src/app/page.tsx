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
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userRoles = (session as { roles?: string[] })?.roles ?? [];

  // 사용자는 사용자 대시보드로
  if (userRoles.includes(ACCOUNT_ROLES.USER)) {
    redirect(USER_ROOT_PATH);
  }

  // 관리자는 관리자 대시보드로
  redirect(ADMIN_ROOT_PATH);
}
