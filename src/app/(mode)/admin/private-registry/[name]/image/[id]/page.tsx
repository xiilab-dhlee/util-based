import type { Metadata } from "next";

import { RegistryImageDetailMain } from "@/components/registry/registry-image/registry-image-detail-main";

/**
 * 관리자 내부 레지스트리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "내부 레지스트리 | AstraGo",
};

// 관리자 레지스트리 이미지 상세 페이지
export default function AdminPrivateRegistryImageDetailPage() {
  return <RegistryImageDetailMain />;
}
