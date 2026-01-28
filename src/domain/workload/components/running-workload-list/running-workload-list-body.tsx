"use client";

import { useAtom, useAtomValue } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { ActiveWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ACTIVE_WORKLOAD_SORT_FIELDS,
  type ActiveWorkloadSortField,
} from "@/domain/workload/constants/workload.constant";
import { runningWorkloadSortAtom } from "@/domain/workload/state/workload.atom";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";

interface RunningWorkloadListBodyProps {
  content: ActiveWorkloadResponse[];
  loading: boolean;
  isError?: boolean;
}

/**
 * 실행중(RUNNING) 워크로드 목록 테이블 컴포넌트
 *
 * 워크로드 목록을 테이블 형태로 표시합니다.
 */
export function RunningWorkloadListBody({
  content,
  loading,
  isError = false,
}: RunningWorkloadListBodyProps) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const [sort, setSort] = useAtom(runningWorkloadSortAtom);
  const columnConfigs = [
    { key: "workloadName", width: "44%" },
    { key: "jobType", width: "16%" },
    { key: "creatorName", width: "18%" },
    { key: "ageSeconds", width: "22%" },
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
    <CustomizedTable
      columns={createWorkloadColumn(columnConfigs, workspaceId, sort)}
      data={content}
      activePadding
      loading={loading}
      isError={isError}
      rowKey={(record) => String(record.workloadResourceName)}
      onChange={handleChange}
    />
  );
}
