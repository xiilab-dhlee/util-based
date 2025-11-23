"use client";

import { InternalRegistryImageDetailAside } from "@/domain/internal-registry-image/components/detail/internal-registry-image-detail-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { DeleteInternalRegistryImageModal } from "../delete-internal-registry-image-modal";
import { CreateInternalRegistryImageTagModal } from "./create-internal-registry-image-tag-modal";
import { DeleteInternalRegistryImageTagModal } from "./delete-internal-registry-image-tag-modal";
import { InternalRegistryImageTagListBody } from "./internal-registry-image-tag-list-body";
import { InternalRegistryImageTagListFilter } from "./internal-registry-image-tag-list-filter";
import { InternalRegistryImageTagListFooter } from "./internal-registry-image-tag-list-footer";
import { UpdateInternalRegistryImageModal } from "./update-internal-registry-image-modal";
/**
 * 내부 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function InternalRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="user.internal-registry-image.detail"
        description="Container Image Information"
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
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 태그 추가 모달 */}
      <CreateInternalRegistryImageTagModal />
      {/* 컨테이너 이미지 정보 수정 모달 */}
      <UpdateInternalRegistryImageModal />
    </>
  );
}
