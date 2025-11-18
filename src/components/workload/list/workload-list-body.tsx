"use client";

import { useAtomValue } from "jotai";

import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/atoms/workload.atom";
import { createWorkloadColumn } from "@/components/common/column/create-workload-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkloads } from "@/hooks/workload/use-get-workloads";
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
          { dataIndex: "isPinned" },
          { dataIndex: "workloadName" },
          { dataIndex: "jobType" },
          { dataIndex: "creatorName" },
          { dataIndex: "elapsedTime" },
          { dataIndex: "labels" },
          { dataIndex: "status" },
          { dataIndex: "log" },
          { dataIndex: "terminal" },
          { dataIndex: "port" },
          { dataIndex: "monitoring" },
          { dataIndex: "power" },
          { dataIndex: "delete" },
        ])}
        data={data?.content || []}
        columnHeight={40}
      />
    </ListWrapper>
  );
}
