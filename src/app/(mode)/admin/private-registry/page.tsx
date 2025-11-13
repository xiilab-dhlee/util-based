import type { Metadata } from "next";

import { PrivateRegistryListMain } from "@/components/registry/private-registry/private-registry-list-main";

/**
 * 관리자 내부 레지스트리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "내부 레지스트리 | AstraGo",
};

// 관리자 레지스트리 메인 페이지
export default function AdminPrivateRegistryPage() {
  return <PrivateRegistryListMain />;
}
