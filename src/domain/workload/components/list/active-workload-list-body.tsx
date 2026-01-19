"use client";

import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface ActiveWorkloadListBodyProps {
  content: WorkloadListType[];
  loading: boolean;
  isError?: boolean;
}

/**
 * 활성화 워크로드 목록 페이지 본문 컴포넌트
 *
 * 활성화 워크로드 목록 페이지에서 활성 워크로드 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 워크로드 목록 데이터
 * @param loading - 로딩 여부
 * @param isError - 에러 상태 여부
 * @returns 활성화 워크로드 목록 페이지 본문 컴포넌트
 */
export function ActiveWorkloadListBody({
  content,
  loading,
  isError = false,
}: ActiveWorkloadListBodyProps) {
  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkloadColumn([
          {
            key: "workloadName",
            width: 200,
            ellipsis: true,
            sorter: true,
          },
          { key: "jobType", width: 100 },
          { key: "creatorName", width: 60, ellipsis: true },
          { key: "elapsedTime" },
          { key: "status", width: 80 },
          { key: "log" },
          { key: "terminal", width: 60 },
          { key: "port" },
          { key: "monitoring", width: 60 },
          { key: "power" },
        ])}
        data={content}
        columnHeight={37}
        activePadding
        loading={loading}
        isError={isError}
      />
    </ListWrapper>
  );
}
