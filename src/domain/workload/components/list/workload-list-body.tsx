"use client";

import { useAtomValue } from "jotai";

import { useGetWorkloads } from "@/domain/workload/hooks/use-get-workloads";
import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 워크로드 목록 페이지 본문 컴포넌트
 *
 * 워크로드 목록 페이지에서 워크로드 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 워크로드 목록 페이지 본문 컴포넌트
 */
export function WorkloadListBody() {
  // 페이지 번호
  const page = useAtomValue(workloadPageAtom);
  // 검색어
  const searchText = useAtomValue(workloadSearchTextAtom);

  const { data } = useGetWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createWorkloadColumn([
          // { dataIndex: "isPinned" },
          { dataIndex: "workloadName", width: 200, ellipsis: true },
          { dataIndex: "jobType", width: 100 },
          { dataIndex: "creatorName", width: 60, ellipsis: true },
          { dataIndex: "elapsedTime" },
          { dataIndex: "labels" },
          { dataIndex: "status", width: 80 },
          { dataIndex: "log" },
          { dataIndex: "terminal", width: 60 },
          { dataIndex: "port" },
          { dataIndex: "monitoring", width: 60 },
          { dataIndex: "power" },
          { dataIndex: "delete" },
        ])}
        data={data?.content || []}
        columnHeight={40}
        activePadding
      />
    </ListWrapper>
  );
}
