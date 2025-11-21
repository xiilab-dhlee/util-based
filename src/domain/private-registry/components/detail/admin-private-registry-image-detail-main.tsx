"use client";

import { ViewPrivateRegistryImageTagLogModal } from "@/domain/private-registry-image/components/view-private-registry-image-tag-log-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ListPageMain } from "@/styles/layers/list-page-layers.styled";
import { DeleteAdminPrivateRegistryImageModal } from "../delete-admin-private-registry-image-modal";
import { AdminPrivateRegistryImageDetailAside } from "./admin-private-registry-image-detail-aside";
import { AdminPrivateRegistryImageDetailBody } from "./admin-private-registry-image-detail-body";

export function AdminPrivateRegistryImageDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="admin.private-registry.image"
        description="container image details"
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
