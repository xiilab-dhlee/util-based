"use client";

import { useParams } from "next/navigation";

import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { DeleteInternalRegistryImageTagModal } from "../detail/delete-internal-registry-image-tag-modal";
import { ViewInternalRegistryImageTagLogModal } from "../view-internal-registry-image-tag-log-modal";
import { InternalRegistryImageTagDetailAside } from "./internal-registry-image-tag-detail-aside";
import { InternalRegistryImageTagVulnerabilityListBody } from "./internal-registry-image-tag-vulnerability-list-body";
import { InternalRegistryImageTagVulnerabilityListFilter } from "./internal-registry-image-tag-vulnerability-list-filter";
import { InternalRegistryImageTagVulnerabilityListFooter } from "./internal-registry-image-tag-vulnerability-list-footer";

export function InternalRegistryImageTagDetailMain() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        pageKey="user.internal-registry-image.tag"
        pageParams={{ id: id as string }}
        description="Tag Information"
      />
      <DetailPageBody>
        <InternalRegistryImageTagDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <InternalRegistryImageTagVulnerabilityListFilter />
            <InternalRegistryImageTagVulnerabilityListBody />
            <InternalRegistryImageTagVulnerabilityListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 내부 레지스트리 이미지 태그 삭제 모달 */}
      <DeleteInternalRegistryImageTagModal />
      {/* 내부 레지스트리 이미지 태그 로그 보기 모달 */}
      <ViewInternalRegistryImageTagLogModal />
    </>
  );
}
