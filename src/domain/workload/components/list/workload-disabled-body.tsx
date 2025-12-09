"use client";

import type { DisabledWorkloadListType } from "@/domain/workload/schemas/workload.schema";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface WorkloadDisabledBodyProps {
  content: DisabledWorkloadListType[];
  loading: boolean;
}

/**
 * 비활성화 워크로드 목록 페이지 본문 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지에서 워크로드 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 워크로드 목록 데이터
 * @param loading - 로딩 여부
 * @returns 비활성화 워크로드 목록 페이지 본문 컴포넌트
 */
export function WorkloadDisabledBody({
  content,
  loading,
}: WorkloadDisabledBodyProps) {
  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkloadColumn([
          { dataIndex: "workloadName", width: 200, ellipsis: true },
          { dataIndex: "jobType", width: 100 },
          { dataIndex: "creatorName", width: 60, ellipsis: true },
          { dataIndex: "elapsedTime" },
          { dataIndex: "status", width: 80 },
          { dataIndex: "log" },
          { dataIndex: "monitoring", width: 60 },
          { dataIndex: "restart" },
          { dataIndex: "delete" },
        ])}
        data={content}
        columnHeight={36}
        activePadding
        loading={loading}
      />
    </ListWrapper>
  );
}
