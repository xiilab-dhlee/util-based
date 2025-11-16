"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ViewRejectReasonModal } from "@/components/common/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/components/common/modal/view-request-reason-modal";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { PageHeader } from "@/layouts/common/page-header";
import { ListPageMain } from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import DeleteRegistryImageModal from "./delete-registry-image-modal";
import RegistryImageDetailAside from "./registry-image-detail-aside";
import RegistryImageDetailBody from "./registry-image-detail-body";
import ViewRegistryImageLogModal from "./view-registry-image-log-modal";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM
  {
    title: "레지스트리",
    href: "/admin/registry",
  },
  {
    title: "내부 레지스트리",
    href: "/admin/private-registry",
  },
  { title: "컨테이너 이미지 상세정보" },
];

export function RegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="컨테이너 이미지 상세정보"
        icon="Back"
        description="container image details"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 */}
        <RegistryImageDetailBody />
        {/* 목록 페이지 - 오른쪽 영역 */}
        <RegistryImageDetailAside />
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 이미지 삭제 모달 */}
      <DeleteRegistryImageModal />
      {/* 이미지 로그 모달 */}
      <ViewRegistryImageLogModal />
    </>
  );
}
