import type { Metadata } from "next";

import { PrivateRegistryDetailMain } from "@/components/private-registry/detail/private-registry-detail-main";

/**
 * 내부 레지스트리 상세 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "컨테이너 이미지 상세정보 | AstraGo",
  description: "컨테이너 이미지의 상세 정보를 확인하세요.",
};

/**
 * 내부 레지스트리 상세 페이지 컴포넌트
 */
export default async function PrivateRegistryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PrivateRegistryDetailMain imageId={id} />;
}
