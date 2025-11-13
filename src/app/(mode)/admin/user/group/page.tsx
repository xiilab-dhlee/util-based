import type { Metadata } from "next";

import { GroupMain } from "@/components/group/group-main";

export const metadata: Metadata = {
  title: "그룹 관리 | AstraGo",
};

/**
 * 관리자 그룹 관리 메인 페이지
 */
export default async function AdminUserGroupPage() {
  return <GroupMain />;
}
