"use client";

import { InternalRegistryImageDetailAside } from "@/domain/internal-registry-image/components/detail/internal-registry-image-detail-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { DeleteInternalRegistryImageModal } from "../delete-internal-registry-image-modal";
import { DeleteInternalRegistryImageTagModal } from "./delete-internal-registry-image-tag-modal";
import { InternalRegistryImageTagListBody } from "./internal-registry-image-tag-list-body";
import { InternalRegistryImageTagListFilter } from "./internal-registry-image-tag-list-filter";
import { InternalRegistryImageTagListFooter } from "./internal-registry-image-tag-list-footer";

/**
 * 내부 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function InternalRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="user.internal-registry-image.detail"
        description="Container Image Details"
      />

      {/* 내부 레지스트리 이미지 상세 페이지 메인 영역 */}
      <DetailPageBody>
        <InternalRegistryImageDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <InternalRegistryImageTagListFilter />
            <InternalRegistryImageTagListBody />
            <InternalRegistryImageTagListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 내부 레지스트리 이미지 태그 삭제 모달 */}
      <DeleteInternalRegistryImageTagModal />
      {/* 컨테이너 이미지 삭제 모달 */}
      <DeleteInternalRegistryImageModal />
    </>
  );
}
