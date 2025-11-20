import { redirect } from "next/navigation";

import {
  ADMIN_ROOT_PATH,
  STANDARD_ROOT_PATH,
} from "@/shared/constants/core.constant";
// import { getServerSession } from "next-auth";

// import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "AstraGo",
};

/**
 * 홈페이지 - 권한에 따른 리다이렉트
 * 인증된 사용자는 권한에 따라 admin 또는 standard 영역으로 이동
 *
 * 참고: 기본 인증 체크는 middleware.ts에서 처리되며,
 * 여기서는 역할별 대시보드 라우팅만 담당합니다.
 */
export default function HomePage() {
  // const session = await getServerSession(authOptions);

  // middleware에서 인증 체크를 하므로 여기 도달하는 사용자는 이미 인증됨
  // 하지만 역할 정보는 session에서 가져와야 함
  // const userRoles = session?.roles || [];
  const userRoles = ["admin"];

  // 관리자는 관리자 대시보드로
  if (userRoles.includes("admin")) {
    redirect(ADMIN_ROOT_PATH);
  }

  // 표준 사용자는 표준 대시보드로
  redirect(STANDARD_ROOT_PATH);
}
