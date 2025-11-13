import type { Metadata } from "next";

import { UserListMain } from "@/components/user/list/user-list-main";

export const metadata: Metadata = {
  title: "사용자 목록 | AstraGo",
};

/**
 * 관리자 계정 관리 메인 페이지
 */
export default async function AdminUserPage() {
  return <UserListMain />;
}
