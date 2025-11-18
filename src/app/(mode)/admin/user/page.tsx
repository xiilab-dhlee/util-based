import type { Metadata } from "next";

import { UserListMain } from "@/components/user/list/user-list-main";

export const metadata: Metadata = {
  title: "사용자 목록",
};

/**
 * 관리자 계정 관리 메인 페이지
 */
export default function AdminUserPage() {
  return <UserListMain />;
}
