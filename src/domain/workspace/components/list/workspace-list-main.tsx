"use client";

import { Icon } from "xiilab-ui";

import { DeleteWorkspaceModal } from "@/domain/workspace/components/delete-workspace-modal";
import { WorkspaceListBody } from "@/domain/workspace/components/list/workspace-list-body";
import { WorkspaceListFilter } from "@/domain/workspace/components/list/workspace-list-filter";
import { WorkspaceListFooter } from "@/domain/workspace/components/list/workspace-list-footer";
import { CreateWorkspaceModal } from "@/shared/components/modal/create-workspace-modal";
import { openCreateWorkspaceModalAtom } from "@/shared/hooks/modal.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { PageGuide } from "@/shared/layouts/common/page-guide";
import { PageHeader } from "@/shared/layouts/common/page-header";
import { PageImageGuide } from "@/shared/layouts/common/page-image-guide";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/create-workspace-guide1.png",
    alt: "워크스페이스 가이드 1",
  },
  {
    id: "2",
    src: "/images/create-workspace-guide2.png",
    alt: "워크스페이스 가이드 2",
  },
  {
    id: "3",
    src: "/images/create-workspace-guide3.png",
    alt: "워크스페이스 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Workspace01" color="var(--icon-fill)" />,
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
];

export function WorkspaceListMain() {
  const { onOpen } = useGlobalModal(openCreateWorkspaceModalAtom);

  const handleCreateWorkspace = () => {
    onOpen();
  };

  return (
    <>
      <PageHeader
        pageKey="admin.workspace"
        description="Workspace Management"
      />

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
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "워크스페이스 생성하기",
              onClick: handleCreateWorkspace,
            }}
          />

          {/* 워크스페이스 가이드 이미지 카드 */}
          <PageImageGuide
            title="워크스페이스 가이드"
            guideImages={GUIDE_IMAGES}
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
