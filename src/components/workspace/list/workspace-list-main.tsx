"use client";

import { openCreateWorkspaceModalAtom } from "@/atoms/common/modal.atom";
import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { CreateWorkspaceModal } from "@/components/common/modal/create-workspace-modal";
import { DeleteWorkspaceModal } from "@/components/workspace/delete-workspace-modal";
import { WorkspaceListBody } from "@/components/workspace/list/workspace-list-body";
import { WorkspaceListFilter } from "@/components/workspace/list/workspace-list-filter";
import { WorkspaceListFooter } from "@/components/workspace/list/workspace-list-footer";
import workspaceListConstants from "@/constants/workspace/workspace-list.constant";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "워크스페이스 관리" },
];

import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 워크스페이스 목록 페이지의 메인 컴포넌트
 *
 */
export function WorkspaceListMain() {
  const { onOpen } = useGlobalModal(openCreateWorkspaceModalAtom);

  const handleCreateWorkspace = () => {
    onOpen();
  };

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="워크스페이스 관리"
        icon="Workspace01"
        description="Workspace Management"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 워크스페이스 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 워크스페이스 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Create Workspace"
            title="워크스페이스 관리"
            icon="Plus"
            description={[
              "AstraGo에서는 목적에 맞는 워크스페이스를 생성해 관리할 수",
              "있습니다. 생성된 워크스페이스를 확인하고 관리하세요.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={workspaceListConstants.guides}
            buttonOptions={{
              enabled: true,
              text: "워크스페이스 생성하기",
              onClick: handleCreateWorkspace,
            }}
          />

          {/* 워크스페이스 가이드 이미지 카드 */}
          <PageImageGuide
            title="워크스페이스 가이드"
            guideImages={workspaceListConstants.guideImages}
          />
        </ListPageAside>

        {/* 워크스페이스 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 워크스페이스 목록 필터 */}
          <WorkspaceListFilter />

          {/* 워크스페이스 목록 본문 */}
          <WorkspaceListBody />
          {/* 워크스페이스 목록 페이지네이션 */}
          <WorkspaceListFooter />
        </ListPageBody>
      </ListPageMain>
      {/* 워크스페이스 삭제 모달 */}
      <DeleteWorkspaceModal />
      {/* 워크스페이스 생성 모달 */}
      <CreateWorkspaceModal />
    </>
  );
}
