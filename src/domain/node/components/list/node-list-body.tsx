"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createNodeColumn } from "@/domain/node/components/list/create-node-column";
import {
  NODE_SORT_FIELDS,
  type NodeSortState,
} from "@/domain/node/constants/node-list.constant";
import { nodeSortAtom } from "@/domain/node/state/node.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 노드 목록 테이블 컬럼 설정 생성
 */
const getColumnConfig = (sort: NodeSortState): CoreCreateColumnConfig[] => [
  { key: "index", width: "5%" },
  {
    key: "nodeName",
    width: "14%",
    sorter: true,
    sortOrder: getColumnSortOrder(sort, "nodeName"),
  },
  { key: "nodeIp", width: "11%" },
  { key: "gpuType", width: "11%", ellipsis: true },
  { key: "gpuUtilizationPercent", width: "8%" },
  { key: "gpuCount", width: "6%" },
  { key: "cpuUtilizationPercent", width: "6%" },
  { key: "memoryUtilizationPercent", width: "8%" },
  { key: "diskUtilizationPercent", width: "6%" },
  { key: "createdAt", width: "10%" },
  { key: "isScheduling", width: "7%" },
  { key: "gpuDivision", width: "8%" },
];

interface NodeListBodyProps {
  content: ClusterNodeListResponse[];
  loading: boolean;
  isError?: boolean;
}

/**
 * 노드 목록 페이지 본문 컴포넌트
 *
 * 노드 목록 페이지에서 노드 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 노드 목록 데이터
 * @param loading - 로딩 여부
 * @param isError - 에러 상태 여부
 * @returns 노드 목록 페이지 본문 컴포넌트
 */
export function NodeListBody({
  content,
  loading,
  isError = false,
}: NodeListBodyProps) {
  const [sort, setSort] = useAtom(nodeSortAtom);

  const handleChange: TableProps<ClusterNodeListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, NODE_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createNodeColumn(getColumnConfig(sort))}
        data={content}
        columnHeight={40}
        loading={loading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="nodeName"
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
