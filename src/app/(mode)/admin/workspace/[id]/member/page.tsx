import type { Metadata } from "next";

import { WorkspaceMemberMain } from "@/components/workspace/member/workspace-member-main";

/**
 * 워크스페이스 관리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "워크스페이스 관리 | AstraGo",
};

/**
 * 표준 사용자 워크스페이스 관리 페이지
 */
export default function AdminWorkspaceMemberPage() {
  return <WorkspaceMemberMain />;
}
