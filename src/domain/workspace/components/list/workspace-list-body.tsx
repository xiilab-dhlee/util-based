"use client";

import { useAtomValue } from "jotai";

import { useGetWorkspaces } from "@/domain/workspace/hooks/use-get-workspaces";
import {
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/domain/workspace/state/workspace.atom";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 워크스페이스 목록 페이지 본문 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 워크스페이스 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 워크스페이스 목록 페이지 본문 컴포넌트
 */
export function WorkspaceListBody() {
  // 페이지 번호
  const page = useAtomValue(workspacePageAtom);
  // 검색어
  const searchText = useAtomValue(workspaceSearchTextAtom);

  const { data } = useGetWorkspaces({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createWorkspaceColumn([
          { dataIndex: "checkbox" },
          { dataIndex: "name" },
          { dataIndex: "creatorName" },
          { dataIndex: "creatorDate" },
          { dataIndex: "gpu" },
          { dataIndex: "gpuUsage" },
          { dataIndex: "gpuQuota" },
          { dataIndex: "cpu" },
          { dataIndex: "cpuUsage" },
          { dataIndex: "cpuQuota" },
          { dataIndex: "mem" },
          { dataIndex: "memUsage" },
          { dataIndex: "memQuota" },
        ])}
        data={data?.content || []}
        columnHeight={40}
      />
    </ListWrapper>
  );
}
