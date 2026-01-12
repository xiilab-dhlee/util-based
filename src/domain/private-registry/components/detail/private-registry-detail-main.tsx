"use client";

import { DeletePrivateRegistryModal } from "@/domain/private-registry/components/delete-private-registry-modal";
import { PrivateRegistryDetailAside } from "@/domain/private-registry/components/detail/private-registry-detail-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { PrivateRegistryTagListBody } from "./private-registry-tag-list-body";
import { PrivateRegistryTagListFilter } from "./private-registry-tag-list-filter";
import { PrivateRegistryTagListFooter } from "./private-registry-tag-list-footer";

/**
 * 프라이빗 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function PrivateRegistryDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="user.private-registry.detail" />

      {/* 프라이빗 레지스트리 이미지 상세 페이지 메인 영역 */}
      <DetailPageBody>
        <PrivateRegistryDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <PrivateRegistryTagListFilter />
            <PrivateRegistryTagListBody />
            <PrivateRegistryTagListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 프라이빗 레지스트리 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
    </>
  );
}
