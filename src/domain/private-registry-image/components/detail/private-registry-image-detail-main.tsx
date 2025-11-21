"use client";

import { PrivateRegistryImageDetailAside } from "@/domain/private-registry-image/components/detail/private-registry-image-detail-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { DeletePrivateRegistryImageModal } from "../delete-private-registry-image-modal";
import { CreatePrivateRegistryImageTagModal } from "./create-private-registry-image-tag-modal";
import { DeletePrivateRegistryImageTagModal } from "./delete-private-registry-image-tag-modal";
import { PrivateRegistryImageTagListBody } from "./private-registry-image-tag-list-body";
import { PrivateRegistryImageTagListFilter } from "./private-registry-image-tag-list-filter";
import { PrivateRegistryImageTagListFooter } from "./private-registry-image-tag-list-footer";
import { UpdatePrivateRegistryImageModal } from "./update-private-registry-image-modal";

/**
 * 내부 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function PrivateRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="user.private-registry-image.detail"
        description="Container Image Information"
      />

      {/* 내부 레지스트리 이미지 상세 페이지 메인 영역 */}
      <DetailPageBody>
        <PrivateRegistryImageDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <PrivateRegistryImageTagListFilter />
            <PrivateRegistryImageTagListBody />
            <PrivateRegistryImageTagListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 내부 레지스트리 이미지 태그 삭제 모달 */}
      <DeletePrivateRegistryImageTagModal />
      {/* 컨테이너 이미지 삭제 모달 */}
      <DeletePrivateRegistryImageModal />
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 태그 추가 모달 */}
      <CreatePrivateRegistryImageTagModal />
      {/* 컨테이너 이미지 정보 수정 모달 */}
      <UpdatePrivateRegistryImageModal />
    </>
  );
}
