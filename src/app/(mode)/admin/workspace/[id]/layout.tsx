import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { DeleteWorkspaceModal } from "@/domain/workspace/components/delete-workspace-modal";
import { WorkspaceDetailPageAside } from "@/domain/workspace/components/detail/workspace-detail-page-aside";
import { RouteTab } from "@/shared/components/tab";
import { PageHeader } from "@/shared/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

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
      {/* 워크스페이스 삭제 모달 */}
      <DeleteWorkspaceModal />
    </>
  );
}
