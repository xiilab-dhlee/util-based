"use client";

import { useParams } from "next/navigation";

import { useGetPrivateImageDetail } from "@/api/generated/private-registry/private-registry";
import { CriticalVulnerabilityList } from "@/domain/private-registry/components/tag/critical-vulnerability-list";
import { PrivateRegistryTagIntroCard } from "@/domain/private-registry/components/tag/private-registry-tag-intro-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 개인 레지스트리 태그 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 1. name 파라미터로 이미지 상세 조회 (imageId 획득)
 * 2. imageId, tagId, harborImageName으로 태그 상세 조회
 */
export function PrivateRegistryTagAside() {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  // 1. 이미지 상세 조회 (imageId 획득)
  const { data } = useGetPrivateImageDetail(
    { harborImageName },
    { query: { enabled: !!harborImageName } },
  );

  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryTagIntroCard imageId={data?.imageId ?? 0} />
      <AsideFillCard title="취약점 Critical 목록" titleExtra={`총 1,000개`}>
        <CriticalVulnerabilityList />
      </AsideFillCard>
    </DetailPageAside>
  );
}
