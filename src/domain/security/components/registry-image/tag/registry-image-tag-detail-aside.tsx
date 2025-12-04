"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { RegistryImageTagDetailIntroCard } from "@/domain/security/components/registry-image/tag/registry-image-tag-detail-intro-card";
import { useGetRegistrySecurityTagVulnerabilities } from "@/domain/security/hooks/use-get-registry-security-tag-vulnerabilities";
import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { VulnerabilityCard } from "@/shared/components/card/vulnerability-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { REGISTRY_SECURITY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";

/**
 * 레지스트리 이미지 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 이미지 기본 정보 카드와 취약점 Critical 목록을 포함합니다.
 */
export function RegistryImageTagDetailAside() {
  const { tagId } = useParams();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId");
  const publish = usePublish();

  const { data, isLoading, isError } = useGetRegistrySecurityTagVulnerabilities(
    {
      imageId: Number(imageId),
      tagId: Number(tagId),
      page: 0,
      size: 100,
    },
  );

  // CRITICAL severity만 필터링
  const vulnerabilityList: VulnerabilityListType[] =
    data?.content.filter(
      (vulnerability) => vulnerability.severity === "CRITICAL",
    ) ?? [];

  const handleVulnerabilityClick = (vulnerability: VulnerabilityListType) => {
    publish(REGISTRY_SECURITY_EVENTS.sendVulnerabilityInfo, {
      imageId: Number(imageId),
      tagId: Number(tagId),
      vulnerabilityId: vulnerability.id,
      vulnerabilityName: vulnerability.cve,
    });
  };

  if (isLoading) {
    return (
      <DetailPageAside>
        <RegistryImageTagDetailIntroCard />
        <AsideFillCard title="취약점 Critical 목록">
          <GridBody>
            {SKELETON_VULNERABILITY_KEYS.map((key) => (
              <VulnerabilityCard
                key={key}
                {...SKELETON_VULNERABILITY}
                loading
              />
            ))}
          </GridBody>
        </AsideFillCard>
      </DetailPageAside>
    );
  }

  if (isError) {
    return (
      <DetailPageAside>
        <RegistryImageTagDetailIntroCard />
        <AsideFillCard title="취약점 Critical 목록">
          <EmptyText>취약점 목록을 불러오지 못했습니다.</EmptyText>
        </AsideFillCard>
      </DetailPageAside>
    );
  }

  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <RegistryImageTagDetailIntroCard />
      {/* 취약점 Critical 목록 */}
      <AsideFillCard
        title="취약점 Critical 목록"
        titleExtra={`총 ${vulnerabilityList.length}개`}
      >
        {vulnerabilityList.length === 0 && (
          <EmptyText>표시할 Critical 취약점이 없습니다.</EmptyText>
        )}
        {vulnerabilityList.length > 0 && (
          <GridBody>
            {vulnerabilityList.map((vulnerability) => (
              <VulnerabilityCard
                key={vulnerability.id}
                {...vulnerability}
                onClick={handleVulnerabilityClick}
              />
            ))}
          </GridBody>
        )}
      </AsideFillCard>
    </DetailPageAside>
  );
}

const SKELETON_VULNERABILITY: VulnerabilityListType = {
  id: "0",
  cve: "",
  nvd: "",
  redhat: "",
  version: "",
  severity: "CRITICAL",
  package: "",
  updatedVersion: "",
  creatorDateTime: "",
  creatorName: "",
};

const SKELETON_VULNERABILITY_KEYS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
];

const GridBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
  width: 100%;

  ${customScrollbar()}
`;

const EmptyText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 8px;
  font-size: 12px;
  color: #888;
`;
