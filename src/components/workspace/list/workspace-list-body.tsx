"use client";

import { useAtomValue } from "jotai";

import {
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/atoms/workspace/workspace-list.atom";
import createWorkspaceListColumn from "@/components/common/columns/create-workspace-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import workspaceListConstants from "@/constants/workspace/workspace-list.constant";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
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
    size: workspaceListConstants.pageSize,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createWorkspaceListColumn([
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
      />
    </ListWrapper>
  );
}

