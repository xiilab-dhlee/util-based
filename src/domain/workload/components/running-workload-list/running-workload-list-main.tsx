"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import type { GetActiveWorkloadsParams } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RunningWorkloadListBody } from "@/domain/workload/components/running-workload-list/running-workload-list-body";
import { RunningWorkloadListFooter } from "@/domain/workload/components/running-workload-list/running-workload-list-footer";
import {
  ACTIVE_WORKLOAD_SORT_FIELD_MAP,
  DEFAULT_RUNNING_WORKLOAD_SORT_API,
  RUNNING_WORKLOAD_PAGE_SIZE,
} from "@/domain/workload/constants/workload.constant";
import { useGetActiveWorkloadsWithPolling } from "@/domain/workload/hooks/use-get-active-workloads-with-polling";
import {
  runningWorkloadPageAtom,
  runningWorkloadSortAtom,
} from "@/domain/workload/state/workload.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { buildSortRequest } from "@/shared/utils/sort.util";

interface RunningWorkloadListMainProps {
  /** 워크스페이스 ID */
  workspaceId: number | undefined;
}

export function RunningWorkloadListMain({
  workspaceId,
}: RunningWorkloadListMainProps) {
  const page = useAtomValue(runningWorkloadPageAtom);
  const sort = useAtomValue(runningWorkloadSortAtom);
  const resetPage = useResetAtom(runningWorkloadPageAtom);
  const resetSort = useResetAtom(runningWorkloadSortAtom);

  // 마운트 시 atom 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 목적
  useEffect(() => {
    resetPage();
    resetSort();
  }, []);

  // 정렬 변경 시 페이지 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 정렬 변경 시 페이지 초기화 목적
  useEffect(() => {
    resetPage();
  }, [sort]);

  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: ACTIVE_WORKLOAD_SORT_FIELD_MAP,
  });

  const params: GetActiveWorkloadsParams = {
    pageNo: page - 1,
    pageSize: RUNNING_WORKLOAD_PAGE_SIZE,
    keyword: undefined,
    workloadStatus: "RUNNING",
    ...(sortRequest || DEFAULT_RUNNING_WORKLOAD_SORT_API),
  };

  const { data, isLoading, isError } = useGetActiveWorkloadsWithPolling({
    workspaceId: workspaceId ?? 0,
    params,
    enabled: Boolean(workspaceId),
  });

  return (
    <>
      <MySearchFilter
        title="실행중인 워크로드 목록"
        total={data?.totalSize ?? 0}
      />
      <RunningWorkloadListBody
        content={data?.content ?? []}
        loading={isLoading}
        isError={isError}
      />
      <RunningWorkloadListFooter
        total={data?.totalSize ?? 0}
        loading={isLoading}
      />
    </>
  );
}
