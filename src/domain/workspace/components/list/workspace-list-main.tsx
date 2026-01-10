"use client";

import { useAtomValue } from "jotai";
import { Icon } from "xiilab-ui";

import { CreateWorkspaceModal } from "@/domain/workspace/components/create-workspace-modal";
import { DeleteWorkspaceModal } from "@/domain/workspace/components/delete-workspace-modal";
import { WorkspaceListBody } from "@/domain/workspace/components/list/workspace-list-body";
import { WorkspaceListFilter } from "@/domain/workspace/components/list/workspace-list-filter";
import { WorkspaceListFooter } from "@/domain/workspace/components/list/workspace-list-footer";
import { useGetWorkspaces } from "@/domain/workspace/hooks/use-get-workspaces";
import {
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/domain/workspace/state/workspace.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateWorkspaceModalAtom } from "@/shared/state/modal.atom";
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
  {
    icon: <Icon name="Resource" color="var(--icon-fill)" />,
    title: "워크스페이스 목록이란?",
    description: [
      "워크스페이스 목록은 팀별 작업공간을 관리하는 페이지입니다.",
      "각 워크스페이스의 자원 사용률과 생성자 · 생성일 정보를 한눈에",
      "확인할 수 있습니다",
    ],
  },
];

export function WorkspaceListMain() {
  const { onOpen } = useGlobalModal(openCreateWorkspaceModalAtom);

  // Atom 상태 읽기
  const page = useAtomValue(workspacePageAtom);
  const searchText = useAtomValue(workspaceSearchTextAtom);

  // API 호출 (Main에서 한 번만 호출)
  const { data, isLoading } = useGetWorkspaces({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

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
          <WorkspaceListFilter
            total={data?.totalSize || 0}
            loading={isLoading}
          />
          {/* 워크스페이스 목록 본문 */}
          <WorkspaceListBody
            content={data?.content || []}
            loading={isLoading}
          />
          {/* 워크스페이스 목록 페이지네이션 */}
          <WorkspaceListFooter
            total={data?.totalSize || 0}
            loading={isLoading}
            workspaces={data?.content || []}
          />
        </ListPageBody>
      </ListPageMain>
      {/* 워크스페이스 삭제 모달 */}
      <DeleteWorkspaceModal />
      {/* 워크스페이스 생성 모달 */}
      <CreateWorkspaceModal />
    </>
  );
}
