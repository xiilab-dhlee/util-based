"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { ListPageMain } from "@/styles/layers/list-page-layers.styled";
import { DeletePrivateRegistryModal } from "../delete-private-registry-modal";
import { PrivateRegistryDetailAside } from "./private-registry-detail-aside";
import { PrivateRegistryDetailBody } from "./private-registry-detail-body";

export function PrivateRegistryDetailMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="user.private-registry.detail" />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 */}
        <PrivateRegistryDetailBody />
        {/* 목록 페이지 - 오른쪽 영역 */}
        <PrivateRegistryDetailAside />
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
      {/* 이미지 태그 로그 모달 */}
      {/* <ViewPrivateRegistryImageTagLogModal /> */}
    </>
  );
}
