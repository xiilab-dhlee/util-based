"use client";

import { useParams } from "next/navigation";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PageHeader } from "@/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { DeletePrivateRegistryImageTagModal } from "../detail/delete-private-registry-image-tag-modal";
import { ViewPrivateRegistryImageTagLogModal } from "../view-private-registry-image-tag-log-modal";
import { PrivateRegistryImageTagDetailAside } from "./private-registry-image-tag-detail-aside";
import { PrivateRegistryImageTagVulnerabilityListBody } from "./private-registry-image-tag-vulnerability-list-body";
import { PrivateRegistryImageTagVulnerabilityListFilter } from "./private-registry-image-tag-vulnerability-list-filter";
import { PrivateRegistryImageTagVulnerabilityListFooter } from "./private-registry-image-tag-vulnerability-list-footer";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  { title: "대시보드", href: "/standard/dashboard" },
  { title: "내부 레지스트리", href: "/standard/private-registry-image" },
  {
    title: "컨테이너 이미지 상세정보",
    href: "/standard/private-registry-image/[id]",
  },
  { title: "태그 상세정보" },
];

export function PrivateRegistryImageTagDetailMain() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        title="태그 상세정보"
        icon="Back"
        description="Tag Information"
        customPathname={`/standard/private-registry-image/${id}`}
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
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
