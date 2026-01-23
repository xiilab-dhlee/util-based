"use client";

import { PrivateRegistryTagIntroCard } from "@/domain/private-registry/components/tag/private-registry-tag-intro-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { CriticalVulnerabilityList } from "./critical-vulnerability-list";

/**
 * 개인 레지스트리 태그 상세 페이지 왼쪽 영역 컴포넌트
 */
export function PrivateRegistryTagAside() {
  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryTagIntroCard />
      <AsideFillCard title="취약점 Critical 목록" titleExtra={`총 1,000개`}>
        <CriticalVulnerabilityList />
      </AsideFillCard>
    </DetailPageAside>
  );
}
