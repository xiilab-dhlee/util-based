"use client";

import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface WorkloadListBodyProps {
  content: WorkloadListType[];
  loading: boolean;
}

/**
 * 워크로드 목록 테이블 컴포넌트 (관리자용)
 *
 * 워크스페이스 상세 페이지에서 전체 워크로드 목록을 표시하는 테이블입니다.
 *
 * @param content - 워크로드 목록 데이터
 * @param loading - 로딩 여부
 */
export function WorkloadListBody({ content, loading }: WorkloadListBodyProps) {
  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkloadColumn([
          {
            dataIndex: "workloadName",
            width: 200,
            ellipsis: true,
            sorter: true,
          },
          { dataIndex: "jobType", width: 100 },
          { dataIndex: "creatorName", width: 60, ellipsis: true },
          { dataIndex: "elapsedTime" },
          { dataIndex: "status", width: 80 },
          { dataIndex: "log" },
          { dataIndex: "terminal", width: 60 },
          { dataIndex: "port" },
          { dataIndex: "monitoring", width: 60 },
          { dataIndex: "power" },
          { dataIndex: "delete" },
        ])}
        data={content}
        columnHeight={37}
        activePadding
        loading={loading}
      />
    </ListWrapper>
  );
}
