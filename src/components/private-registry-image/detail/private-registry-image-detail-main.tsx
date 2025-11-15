"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ViewRejectReasonModal } from "@/components/common/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/components/common/modal/view-request-reason-modal";
import { PrivateRegistryImageDetailAside } from "@/components/private-registry-image/detail/private-registry-image-detail-aside";
import { PrivateRegistryImageDetailBody } from "@/components/private-registry-image/detail/private-registry-image-detail-body";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard",
  },
  {
    title: "내부 레지스트리",
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
        icon="Image"
        description="Container Image Details"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 내부 레지스트리 이미지 상세 페이지 메인 영역 */}
      <ListPageMain>
        {/* 내부 레지스트리 이미지 상세 페이지 - 왼쪽 영역 (기본정보) */}
        <ListPageAside $width={400}>
          <PrivateRegistryImageDetailAside />
        </ListPageAside>

        {/* 내부 레지스트리 이미지 상세 페이지 - 오른쪽 영역 (태그 목록) */}
        <ListPageBody>
          <PrivateRegistryImageDetailBody />
        </ListPageBody>
      </ListPageMain>

      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
    </>
  );
}
