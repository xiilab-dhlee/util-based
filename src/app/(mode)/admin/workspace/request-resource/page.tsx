import type { Metadata } from "next";

import { WorkspaceRequestResourceMain } from "@/components/workspace/request-resource/workspace-request-resource-main";

/**
 * 관리자 리소스 신청 관리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "리소스 신청 관리",
};

/**
 * 관리자 리소스 신청 관리 페이지
 */
export default function AdminWorkspaceRequestResourcePage() {
  return <WorkspaceRequestResourceMain />;
}
