"use client";

import { useParams } from "next/navigation";

import { RegistryImageTagDetailAside } from "@/domain/security/components/registry-image/tag/registry-image-tag-detail-aside";
import { RegistryImageTagVulnerabilityListBody } from "@/domain/security/components/registry-image/tag/registry-image-tag-vulnerability-list-body";
import { RegistryImageTagVulnerabilityListFooter } from "@/domain/security/components/registry-image/tag/registry-image-tag-vulnerability-list-footer";
import { ViewRegistrySecurityVulnerabilityInfoModal } from "@/domain/security/components/registry-image/tag/view-registry-security-vulnerability-info-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

export function RegistryImageTagDetailMain() {
  const { tagId } = useParams();

  return (
    <>
      <PageHeader
        pageKey="admin.registry-security.tag"
        pageParams={{ tagId: tagId as string }}
        description="Tag Information"
      />
      <DetailPageBody>
        <RegistryImageTagDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <RegistryImageTagVulnerabilityListBody />
            <RegistryImageTagVulnerabilityListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 레지스트리 보안 취약점 상세 정보 모달 */}
      <ViewRegistrySecurityVulnerabilityInfoModal />
    </>
  );
}
