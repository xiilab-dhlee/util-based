"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PrivateRegistryImageDetailAside } from "@/components/private-registry-image/detail/private-registry-image-detail-aside";
import { PageHeader } from "@/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { DeletePrivateRegistryImageModal } from "../delete-private-registry-image-modal";
import { DeletePrivateRegistryImageTagModal } from "./delete-private-registry-image-tag-modal";
import { PrivateRegistryImageTagListBody } from "./private-registry-image-tag-list-body";
import { PrivateRegistryImageTagListFilter } from "./private-registry-image-tag-list-filter";
import { PrivateRegistryImageTagListFooter } from "./private-registry-image-tag-list-footer";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard",
  },
  {
    title: "내부 레지스트리",
    href: "/standard/private-registry",
  },
  { title: "컨테이너 이미지 상세정보" },
];

/**
 * 내부 레지스트리 이미지 상세 페이지 메인 컴포넌트
 */
export function PrivateRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="컨테이너 이미지 상세정보"
        icon="Back"
        description="Container Image Details"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

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
    </>
  );
}
