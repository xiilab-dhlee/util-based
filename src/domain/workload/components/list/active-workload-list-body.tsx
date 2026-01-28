"use client";

import { useAtom, useAtomValue } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { ActiveWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ACTIVE_WORKLOAD_SORT_FIELDS,
  type ActiveWorkloadSortField,
} from "@/domain/workload/constants/workload.constant";
import { activeWorkloadSortAtom } from "@/domain/workload/state/workload.atom";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface ActiveWorkloadListBodyProps {
  content: ActiveWorkloadResponse[];
  loading: boolean;
  isError?: boolean;
}

export function ActiveWorkloadListBody({
  content,
  loading,
  isError = false,
}: ActiveWorkloadListBodyProps) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const [sort, setSort] = useAtom(activeWorkloadSortAtom);
  const columnConfigs = [
    { key: "workloadName", width: "28%" },
    { key: "jobType", width: "9%" },
    { key: "creatorName", width: "12%" },
    { key: "ageSeconds", width: "14%" },
    { key: "status", width: "7%" },
    { key: "log", width: "6%" },
    { key: "terminal", width: "6%" },
    { key: "port", width: "6%" },
    { key: "monitoring", width: "6%" },
    { key: "power", width: "6%" },
  ];

  const handleChange: TableProps<ActiveWorkloadResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      ActiveWorkloadResponse,
      ActiveWorkloadSortField
    >(sorter, ACTIVE_WORKLOAD_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkloadColumn(columnConfigs, workspaceId, sort)}
        data={content}
        columnHeight={37}
        activePadding
        loading={loading}
        isError={isError}
        rowKey={(record) => String(record.workloadResourceName)}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
