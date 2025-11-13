"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import ViewRejectReasonModal from "../../common/modal/view-reject-reason-modal";
import ViewRequestReasonModal from "../../common/modal/view-request-reason-modal";
import ApproveResourceModal from "./approve-request-resource-modal";
import RejectResourceModal from "./reject-request-resource-modal";
import WorkspaceRequestResourceBody from "./workspace-request-resource-body";
import WorkspaceRequestResourceFilter from "./workspace-request-resource-filter";
import WorkspaceRequestResourceFooter from "./workspace-request-resource-footer";
import WorkspaceResourcePageAside from "./workspace-resource-page-aside";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "워크스페이스 관리", href: "/admin/workspace" },
  { title: "리소스 신청 관리" },
];

/**
 * 워크스페이스 리소스 요청 목록 페이지의 메인 컴포넌트
 *
 */
export function WorkspaceRequestResourceMain() {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="리소스 신청 관리"
        icon="Back"
        description="Resource Application"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크스페이스 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <WorkspaceResourcePageAside />
        </ListPageAside>
        {/* 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <WorkspaceRequestResourceFilter />
          {/* 목록 본문 */}
          <WorkspaceRequestResourceBody />
          {/* 목록 페이지네이션 */}
          <WorkspaceRequestResourceFooter />
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
