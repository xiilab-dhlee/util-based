import type { Metadata } from "next";

import { AccountPendingListMain } from "@/domain/account-management/components/pending/account-pending-list-main";

export const metadata: Metadata = {
  title: "가입 승인 관리",
};

/**
 * 관리자 가입 승인 관리 메인 페이지
 */
export default function AdminUserPendingListPage() {
  return <AccountPendingListMain />;
}
