"use client";

import type { SorterResult } from "antd/es/table/interface";
import { useAtom, useSetAtom } from "jotai";

import type { ActiveWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  monitoringActiveWorkloadPageAtom,
  monitoringActiveWorkloadSortAtom,
} from "@/domain/monitoring/state/monitoring.atom";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

type AntdTableSortOrder = "ascend" | "descend";
type SortDirection = "ASC" | "DESC";

const toSortDirection = (order: AntdTableSortOrder): SortDirection =>
  order === "ascend" ? "ASC" : "DESC";

const toSortOrder = (direction: SortDirection): AntdTableSortOrder =>
  direction === "ASC" ? "ascend" : "descend";

const getSortOrder = (
  sortState: { sortBy: string; sortDirection: SortDirection },
  field: string,
): AntdTableSortOrder | null =>
  sortState.sortBy === field ? toSortOrder(sortState.sortDirection) : null;

interface MonitoringActiveWorkloadListBodyProps {
  workloads: ActiveWorkloadResponse[];
  isLoading?: boolean;
  isError?: boolean;
}

export function MonitoringActiveWorkloadListBody({
  workloads,
  isLoading = false,
  isError = false,
}: MonitoringActiveWorkloadListBodyProps) {
  const [sort, setSort] = useAtom(monitoringActiveWorkloadSortAtom);
  const setPage = useSetAtom(monitoringActiveWorkloadPageAtom);

  const columns = createWorkloadColumn([
    {
      key: "workloadName",
      width: "30%",
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder(sort, "workloadName"),
    },
    {
      key: "nodeName",
      width: "21%",
      ellipsis: true,
    },
    {
      key: "jobType",
      width: "17%",
      sorter: true,
      sortOrder: getSortOrder(sort, "jobType"),
    },
    { key: "status", width: "12%" },
    { key: "creatorName", width: "20%", ellipsis: true },
  ]);

  const handleSortChange = (
    sorter:
      | SorterResult<ActiveWorkloadResponse>
      | SorterResult<ActiveWorkloadResponse>[],
  ) => {
    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!single.field || !single.order) return;

    setSort({
      sortBy: String(single.field),
      sortDirection: toSortDirection(single.order as AntdTableSortOrder),
    });
    setPage(1);
  };

  return (
    <ListWrapper>
      <CustomizedTable<ActiveWorkloadResponse>
        columns={columns}
        data={workloads}
        rowKey="workloadId"
        activePadding
        loading={isLoading}
        isError={isError}
        scroll={{ x: "100%" }}
        onChange={(_pagination, _filters, sorter) => {
          handleSortChange(sorter);
        }}
      />
    </ListWrapper>
  );
}
