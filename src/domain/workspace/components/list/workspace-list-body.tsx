"use client";

import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface WorkspaceListBodyProps {
  /** 워크스페이스 목록 데이터 */
  content: WorkspaceListType[];
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 워크스페이스 목록 페이지 본문 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 워크스페이스 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 워크스페이스 목록 데이터
 * @param loading - 로딩 상태
 */
export function WorkspaceListBody({
  content,
  loading,
}: WorkspaceListBodyProps) {
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
        data={content}
        columnHeight={40}
        loading={loading}
      />
    </ListWrapper>
  );
}
