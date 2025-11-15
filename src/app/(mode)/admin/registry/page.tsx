import type { Metadata } from "next";

import { RegistryMain } from "@/components/registry/registry-main";

/**
 * 표준 사용자 워크로드 목록 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "레지스트리",
};
// 관리자 레지스트리 메인 페이지
export default function AdminRegistryMainPage() {
  return <RegistryMain />;
}
