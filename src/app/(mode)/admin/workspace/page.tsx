import type { Metadata } from "next";

import { WorkspaceListMain } from "@/components/workspace/list/workspace-list-main";

/**
 * 표준 사용자 워크로드 목록 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "Workspace Management",
};
// 관리자 워크스페이스 관리 페이지
export default function AdminWorkspacePage() {
  return <WorkspaceListMain />;
}
