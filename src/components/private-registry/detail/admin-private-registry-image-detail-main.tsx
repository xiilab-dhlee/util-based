"use client";

import { ViewRejectReasonModal } from "@/components/common/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/components/common/modal/view-request-reason-modal";
import { ViewPrivateRegistryImageTagLogModal } from "@/components/private-registry-image/view-private-registry-image-tag-log-modal";
import { PageHeader } from "@/layouts/common/page-header";
import { ListPageMain } from "@/styles/layers/list-page-layers.styled";
import { DeleteAdminPrivateRegistryImageModal } from "../delete-admin-private-registry-image-modal";
import { AdminPrivateRegistryImageDetailAside } from "./admin-private-registry-image-detail-aside";
import { AdminPrivateRegistryImageDetailBody } from "./admin-private-registry-image-detail-body";

export function AdminPrivateRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="컨테이너 이미지 상세정보"
        icon="Back"
        description="container image details"
        breadcrumbKey="admin.private-registry.image"
      />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 */}
        <AdminPrivateRegistryImageDetailBody />
        {/* 목록 페이지 - 오른쪽 영역 */}
        <AdminPrivateRegistryImageDetailAside />
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 이미지 삭제 모달 */}
      <DeleteAdminPrivateRegistryImageModal />
      {/* 이미지 태그 로그 모달 */}
      <ViewPrivateRegistryImageTagLogModal />
    </>
  );
}
