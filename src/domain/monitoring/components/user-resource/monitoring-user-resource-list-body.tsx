"use client";

import type { SorterResult } from "antd/es/table/interface";
import { useAtom, useSetAtom } from "jotai";

import type { AccountResourceSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  monitoringUserResourcePageAtom,
  monitoringUserResourceSortAtom,
} from "@/domain/monitoring/state/monitoring.atom";
import { createUserResourceColumn } from "@/shared/components/column/create-user-resource-column";
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

interface MonitoringUserResourceListBodyProps {
  userResources: AccountResourceSummaryResponse[];
  isLoading?: boolean;
  isError?: boolean;
}

export function MonitoringUserResourceListBody({
  userResources,
  isLoading = false,
  isError = false,
}: MonitoringUserResourceListBodyProps) {
  const [sort, setSort] = useAtom(monitoringUserResourceSortAtom);
  const setPage = useSetAtom(monitoringUserResourcePageAtom);

  const columns = createUserResourceColumn([
    {
      key: "userName",
      width: "25%",
      align: "left",
      sorter: true,
      sortOrder: getSortOrder(sort, "userName"),
    },
    { key: "gpu", width: "18.75%", align: "center" },
    { key: "mig", width: "18.75%", align: "center" },
    { key: "cpu", width: "18.75%", align: "center" },
    { key: "mem", width: "18.75%", align: "center" },
  ]);

  const handleSortChange = (
    sorter:
      | SorterResult<AccountResourceSummaryResponse>
      | SorterResult<AccountResourceSummaryResponse>[],
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
      <CustomizedTable<AccountResourceSummaryResponse>
        columns={columns}
        data={userResources}
        rowKey="accountId"
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
