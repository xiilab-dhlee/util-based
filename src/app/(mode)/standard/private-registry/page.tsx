import type { Metadata } from "next";

import { PrivateRegistryListMain } from "@/components/private-registry/list/private-registry-list-main";

/**
 * 표준 사용자 프라이빗 레지스트리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "내부 레지스트리 | AstraGo",
  description: "내부 컨테이너 레지스트리를 관리하세요.",
};

/**
 * 표준 사용자 프라이빗 레지스트리 페이지
 */
export default async function StandardPrivateRegistryPage() {
  return <PrivateRegistryListMain />;
}
