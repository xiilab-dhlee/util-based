"use client";

import type { SorterResult } from "antd/es/table/interface";
import type { TableProps } from "xiilab-ui";

import type {
  AdminWorkspaceSummaryResponse,
  GetWorkspaceSummaryListOrder,
  GetWorkspaceSummaryListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createMonitoringWorkspaceColumn } from "@/domain/monitoring/components/column/create-monitoring-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export interface WorkspaceSummarySortState {
  sort: GetWorkspaceSummaryListSort;
  order: GetWorkspaceSummaryListOrder;
}

interface MonitoringWorkspaceListBodyProps {
  workspaces: AdminWorkspaceSummaryResponse[];
  isLoading?: boolean;
  isError?: boolean;
  sortState: WorkspaceSummarySortState;
  onSortChange: (sortState: WorkspaceSummarySortState) => void;
}

/** API 정렬 필드를 Antd 테이블 컬럼 키로 변환 */
const sortFieldToColumnKey: Record<GetWorkspaceSummaryListSort, string> = {
  WORKSPACE_NAME: "name",
  CREATED_AT: "createdAt",
  CREATOR_NAME: "creatorName",
};

/** Antd 테이블 컬럼 키를 API 정렬 필드로 변환 */
const columnKeyToSortField: Record<string, GetWorkspaceSummaryListSort> = {
  name: "WORKSPACE_NAME",
  createdAt: "CREATED_AT",
  creatorName: "CREATOR_NAME",
};

/** API order를 Antd sortOrder로 변환 */
const toAntdSortOrder = (
  order: GetWorkspaceSummaryListOrder,
): "ascend" | "descend" => (order === "ASC" ? "ascend" : "descend");

/** Antd sortOrder를 API order로 변환 */
const toApiOrder = (
  order: "ascend" | "descend",
): GetWorkspaceSummaryListOrder => (order === "ascend" ? "ASC" : "DESC");

export function MonitoringWorkspaceListBody({
  workspaces,
  isLoading = false,
  isError = false,
  sortState,
  onSortChange,
}: MonitoringWorkspaceListBodyProps) {
  const publish = usePublish();

  const handleNameClick = (record: AdminWorkspaceSummaryResponse) => {
    publish(MONITORING_EVENTS.sendWorkspaceSummary, record);
  };

  /** 현재 정렬 상태에 따른 sortOrder 반환 */
  const getSortOrder = (columnKey: string): "ascend" | "descend" | null => {
    const currentColumnKey = sortFieldToColumnKey[sortState.sort];
    return currentColumnKey === columnKey
      ? toAntdSortOrder(sortState.order)
      : null;
  };

  const columns = createMonitoringWorkspaceColumn(
    [
      {
        key: "name",
        width: "24%",
        ellipsis: true,
        sorter: true,
        sortOrder: getSortOrder("name"),
      },
      { key: "gpu", width: "7%" },
      { key: "cpu", width: "7%" },
      { key: "mem", width: "7%" },
      { key: "runningWorkloadCount", width: "8%" },
      { key: "pendingWorkloadCount", width: "8%" },
      { key: "errorWorkloadCount", width: "7%" },
      { key: "creatorName", width: "12%" },
      {
        key: "createdAt",
        width: "12%",
        sorter: true,
        sortOrder: getSortOrder("createdAt"),
      },
    ],
    { onNameClick: handleNameClick },
  );

  const handleChange: TableProps<AdminWorkspaceSummaryResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const single = Array.isArray(sorter)
      ? sorter[0]
      : (sorter as SorterResult<AdminWorkspaceSummaryResponse>);

    if (!single.field || !single.order) return;

    const fieldKey = String(single.field);
    const sortField = columnKeyToSortField[fieldKey];

    if (!sortField) return;

    onSortChange({
      sort: sortField,
      order: toApiOrder(single.order),
    });
  };

  return (
    <ListWrapper>
      <CustomizedTable<AdminWorkspaceSummaryResponse>
        columns={columns}
        data={workspaces}
        rowKey="workspaceId"
        activePadding
        loading={isLoading}
        isError={isError}
        scroll={{ x: "100%", y: "100%" }}
        tableLayout="fixed"
        columnHeight={32}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
