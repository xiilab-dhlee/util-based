"use client";

import { useAtom, useAtomValue } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { TerminatedWorkloadItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  DISABLED_WORKLOAD_SORT_FIELDS,
  type DisabledWorkloadSortField,
} from "@/domain/workload/constants/workload.constant";
import { disabledWorkloadSortAtom } from "@/domain/workload/state/workload.atom";
import { createDisabledWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";

interface DisabledWorkloadListBodyProps {
  content: TerminatedWorkloadItem[];
  loading: boolean;
  isError?: boolean;
}

export function DisabledWorkloadListBody({
  content,
  loading,
  isError = false,
}: DisabledWorkloadListBodyProps) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const [sort, setSort] = useAtom(disabledWorkloadSortAtom);

  const columnConfigs = [
    { key: "workloadName", width: "30%" },
    { key: "jobType", width: "12%" },
    { key: "creatorName", width: "14%" },
    { key: "terminatedAt", width: "14%" },
    { key: "log", width: "7.5%" },
    { key: "monitoring", width: "7.5%" },
    { key: "restart", width: "7.5%" },
    { key: "delete", width: "7.5%" },
  ];

  const handleChange: TableProps<TerminatedWorkloadItem>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      TerminatedWorkloadItem,
      DisabledWorkloadSortField
    >(sorter, DISABLED_WORKLOAD_SORT_FIELDS);

    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
  };

  return (
    <CustomizedTable
      columns={createDisabledWorkloadColumn(columnConfigs, workspaceId, sort)}
      data={content}
      activePadding
      loading={loading}
      isError={isError}
      rowKey={(record) => String(record.workloadResourceName)}
      onChange={handleChange}
    />
  );
}
