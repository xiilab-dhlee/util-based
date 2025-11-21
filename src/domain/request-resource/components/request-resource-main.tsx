"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { ApproveResourceModal } from "./approve-request-resource-modal";
import { RejectResourceModal } from "./reject-request-resource-modal";
import { RequestResourceBody } from "./request-resource-body";
import { RequestResourceFilter } from "./request-resource-filter";
import { RequestResourceFooter } from "./request-resource-footer";
import { ResourcePageAside } from "./resource-page-aside";

export function RequestResourceMain() {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        pageKey="admin.workspace.request-resource"
        description="Resource Application"
      />

      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크스페이스 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <ResourcePageAside />
        </ListPageAside>
        {/* 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <RequestResourceFilter />
          {/* 목록 본문 */}
          <RequestResourceBody />
          {/* 목록 페이지네이션 */}
          <RequestResourceFooter />
        </ListPageBody>
      </ListPageMain>
      {/* 요청 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 리소스 승인 모달 */}
      <ApproveResourceModal />
      {/* 리소스 반려 모달 */}
      <RejectResourceModal />
    </>
  );
}
