import type { Metadata } from "next";

import { FileSecurityMain } from "@/components/security/file-security-main";

export const metadata: Metadata = {
  title: "파일 시스템 보안 | AstraGo",
};

// 관리자 파일 시스템 보안 메인 페이지
export default function AdminFileSecurityPage() {
  return <FileSecurityMain />;
}
