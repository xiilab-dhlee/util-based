import type { Metadata } from "next";

import { UserPendingListMain } from "@/components/user/pending/user-pending-list-main";

export const metadata: Metadata = {
  title: "가입 승인 관리 | AstraGo",
};

/**
 * 관리자 가입 승인 관리 메인 페이지
 */
export default async function AdminUserPendingListPage() {
  return <UserPendingListMain />;
}
