"use client";

import { useParams } from "next/navigation";

import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { DeletePrivateRegistryImageTagModal } from "../detail/delete-private-registry-image-tag-modal";
import { ViewPrivateRegistryImageTagLogModal } from "../view-private-registry-image-tag-log-modal";
import { PrivateRegistryImageTagDetailAside } from "./private-registry-image-tag-detail-aside";
import { PrivateRegistryImageTagVulnerabilityListBody } from "./private-registry-image-tag-vulnerability-list-body";
import { PrivateRegistryImageTagVulnerabilityListFilter } from "./private-registry-image-tag-vulnerability-list-filter";
import { PrivateRegistryImageTagVulnerabilityListFooter } from "./private-registry-image-tag-vulnerability-list-footer";

export function PrivateRegistryImageTagDetailMain() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        pageKey="user.private-registry-image.tag"
        pageParams={{ id: id as string }}
        description="Tag Information"
      />
      <DetailPageBody>
        <PrivateRegistryImageTagDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <PrivateRegistryImageTagVulnerabilityListFilter />
            <PrivateRegistryImageTagVulnerabilityListBody />
            <PrivateRegistryImageTagVulnerabilityListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 내부 레지스트리 이미지 태그 삭제 모달 */}
      <DeletePrivateRegistryImageTagModal />
      {/* 내부 레지스트리 이미지 태그 로그 보기 모달 */}
      <ViewPrivateRegistryImageTagLogModal />
    </>
  );
}
