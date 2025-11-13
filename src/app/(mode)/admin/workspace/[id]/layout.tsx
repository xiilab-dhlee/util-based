"use client";

import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { RouteTab } from "@/components/common/tab";
import { DeleteWorkspaceModal } from "@/components/workspace/delete-workspace-modal";
import { WorkspaceDetailPageAside } from "@/components/workspace/detail/workspace-detail-page-aside";
import { PageHeader } from "@/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "워크스페이스 관리", href: "/admin/workspace" },
  { title: "워크스페이스 정보" },
];

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "워크로드 목록",
    icon: "Workload",
  },
  {
    key: "member",
    label: "워크스페이스 멤버",
    icon: "Person",
  },
];

/**
 * 워크스페이스 상세 페이지 레이아웃
 *
 * 이 레이아웃은 admin/workspace/[id] 하위의 모든 페이지에 적용됩니다.
 * 워크스페이스 상세 정보와 관련된 모든 페이지의 공통 레이아웃을 제공합니다.
 */
export default function WorkspaceDetailLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        title="워크스페이스 정보"
        icon="Back"
        description="Workspace Information"
        customPathname="/admin/workspace"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 워크스페이스 요약 정보 */}
        <WorkspaceDetailPageAside />
        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 */}
          <RouteTab items={TAB_ITEMS} />
          {/* 탭별 콘텐츠 영역 */}
          <DetailContentSection>{children}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 워크스페이스 삭제 모달 */}
      <DeleteWorkspaceModal />
    </>
  );
}
