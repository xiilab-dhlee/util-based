"use client";

import { ViewInternalRegistryImageTagLogModal } from "@/domain/internal-registry-image/components/view-internal-registry-image-tag-log-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ListPageMain } from "@/styles/layers/list-page-layers.styled";
import { DeleteAdminInternalRegistryImageModal } from "../delete-admin-internal-registry-image-modal";
import { AdminInternalRegistryImageDetailAside } from "./admin-internal-registry-image-detail-aside";
import { AdminInternalRegistryImageDetailBody } from "./admin-internal-registry-image-detail-body";

export function AdminInternalRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="admin.internal-registry.image"
        description="container image details"
      />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 */}
        <AdminInternalRegistryImageDetailBody />
        {/* 목록 페이지 - 오른쪽 영역 */}
        <AdminInternalRegistryImageDetailAside />
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 이미지 삭제 모달 */}
      <DeleteAdminInternalRegistryImageModal />
      {/* 이미지 태그 로그 모달 */}
      <ViewInternalRegistryImageTagLogModal />
    </>
  );
}
