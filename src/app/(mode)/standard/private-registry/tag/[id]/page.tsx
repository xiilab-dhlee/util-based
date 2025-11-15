import type { Metadata } from "next";

import { PrivateRegistryTagDetailMain } from "@/components/private-registry/tag-detail/private-registry-tag-detail-main";

export const metadata: Metadata = {
  title: "태그 상세정보",
  description: "컨테이너 이미지 태그의 상세 정보를 확인하세요.",
};

export default async function PrivateRegistryTagDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { verifying } = await searchParams;

  // URL 파라미터로 검증 중 상태를 전달받음
  const isVerifying = verifying === "true";

  return <PrivateRegistryTagDetailMain tagId={id} isVerifying={isVerifying} />;
}
