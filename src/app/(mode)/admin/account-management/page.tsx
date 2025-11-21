import type { Metadata } from "next";

import { AccountListMain } from "@/domain/account-management/components/list/account-list-main";

export const metadata: Metadata = {
  title: "계정 관리",
};

/**
 * 관리자 계정 관리 메인 페이지
 */
export default function AdminUserPage() {
  return <AccountListMain />;
}
