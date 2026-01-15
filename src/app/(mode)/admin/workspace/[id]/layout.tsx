import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { DeleteAdminWorkspaceDetailModal } from "@/domain/workspace/components/detail/delete-admin-workspace-detail-modal";
import { WorkspaceDetailPageAside } from "@/domain/workspace/components/detail/workspace-detail-page-aside";
import { DeleteAdminWorkspacesModal } from "@/domain/workspace/components/list/delete-admin-workspaces-modal";
import { UpdateWorkspaceModal } from "@/domain/workspace/components/update-workspace-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { RouteTab } from "@/shared/components/tab";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "활성화 워크로드 목록",
    icon: "Verification02",
  },
  {
    key: "disabled",
    label: "비활성화 워크로드 목록",
    icon: "Close",
  },
  {
    key: "member",
    label: "워크스페이스 멤버",
    icon: "Person",
  },
];

export const metadata: Metadata = {
  title: "Workspace Management",
};

export default async function WorkspaceDetailLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey="admin.workspace.detail"
        pageParams={{ id }}
        description="Workspace Information"
      />

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
      {/* 워크스페이스 수정 모달 */}
      <UpdateWorkspaceModal />
      {/* 관리자 워크스페이스 상세 삭제 모달 */}
      <DeleteAdminWorkspaceDetailModal />
      {/* 관리자용 워크스페이스 일괄 삭제 모달 */}
      <DeleteAdminWorkspacesModal />
    </>
  );
}
