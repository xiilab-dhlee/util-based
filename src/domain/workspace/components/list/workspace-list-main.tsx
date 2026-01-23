"use client";

import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Icon } from "xiilab-ui";

import { useGetAllWorkspaces1 } from "@/api/generated/admin-workspace/admin-workspace";
import {
  WorkspaceSortRequestOrder,
  WorkspaceSortRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WorkspaceListBody } from "@/domain/workspace/components/list/workspace-list-body";
import { WorkspaceListFilter } from "@/domain/workspace/components/list/workspace-list-filter";
import { WorkspaceListFooter } from "@/domain/workspace/components/list/workspace-list-footer";
import { WORKSPACE_SORT_FIELD_MAP } from "@/domain/workspace/constants/workspace.constant";
import { useWorkspaceListReset } from "@/domain/workspace/hooks/use-workspace-list-reset";
import {
  workspacePageAtom,
  workspaceSearchTextAtom,
  workspaceSortAtom,
} from "@/domain/workspace/state/workspace.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import { buildSortRequest } from "@/shared/utils/sort.util";
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
  const page = useAtomValue(workspacePageAtom);
  const searchText = useAtomValue(workspaceSearchTextAtom);
  const sort = useAtomValue(workspaceSortAtom);

  const { resetAll } = useWorkspaceListReset();

  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: WORKSPACE_SORT_FIELD_MAP,
  });

  const { data, isLoading } = useGetAllWorkspaces1({
    pageSearchRequest: {
      pageNo: page - 1,
      pageSize: LIST_PAGE_SIZE,
      keyword: searchText || undefined,
    },
    sortRequest: {
      sort: sortRequest?.sort ?? WorkspaceSortRequestSort.WORKSPACE_NAME,
      order: sortRequest?.order ?? WorkspaceSortRequestOrder.ASC,
    },
  });

  const totalSize = data?.totalSize ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetAll 함수는 한 번만 호출되어야 함
  useEffect(() => {
    resetAll();
  }, []);

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
              "AstraGo에서는 목적에 맞는 워크스페이스를 관리할 수",
              "있습니다. 생성된 워크스페이스를 확인하고 관리하세요.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={GUIDES}
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
          <WorkspaceListFilter total={totalSize} loading={isLoading} />
          {/* 워크스페이스 목록 본문 */}
          <WorkspaceListBody
            content={data?.content || []}
            loading={isLoading}
          />
          {/* 워크스페이스 목록 페이지네이션 */}
          <WorkspaceListFooter total={totalSize} loading={isLoading} />
        </ListPageBody>
      </ListPageMain>
    </>
  );
}
