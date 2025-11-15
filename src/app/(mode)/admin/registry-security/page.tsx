import type { Metadata } from "next";

import { RegistrySecurityMain } from "@/components/security/registry-security-main";

export const metadata: Metadata = {
  title: "레지스트리 보안",
};

// 관리자 레지스트리 보안 메인 페이지
export default function AdminRegistrySecurityPage() {
  return <RegistrySecurityMain />;
}
