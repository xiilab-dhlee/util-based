"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import type { GetActiveWorkloadsParams } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ActiveWorkloadListBody } from "@/domain/workload/components/list/active-workload-list-body";
import { ActiveWorkloadListFilter } from "@/domain/workload/components/list/active-workload-list-filter";
import { ActiveWorkloadListFooter } from "@/domain/workload/components/list/active-workload-list-footer";
import {
  ACTIVE_WORKLOAD_DEFAULT_SORT,
  ACTIVE_WORKLOAD_SORT_FIELD_MAP,
} from "@/domain/workload/constants/workload.constant";
import { useGetActiveWorkloadsWithPolling } from "@/domain/workload/hooks/use-get-active-workloads-with-polling";
import {
  activeWorkloadIsMineAtom,
  activeWorkloadJobTypeAtom,
  activeWorkloadPageAtom,
  activeWorkloadSearchTextAtom,
  activeWorkloadSortAtom,
  activeWorkloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";

export function ActiveWorkloadListMain() {
  const page = useAtomValue(activeWorkloadPageAtom);
  const searchText = useAtomValue(activeWorkloadSearchTextAtom);
  const jobType = useAtomValue(activeWorkloadJobTypeAtom);
  const status = useAtomValue(activeWorkloadStatusAtom);
  const isMine = useAtomValue(activeWorkloadIsMineAtom);
  const sort = useAtomValue(activeWorkloadSortAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const resetPage = useResetAtom(activeWorkloadPageAtom);
  const resetSort = useResetAtom(activeWorkloadSortAtom);
  const resetSearchText = useResetAtom(activeWorkloadSearchTextAtom);
  const resetJobType = useResetAtom(activeWorkloadJobTypeAtom);
  const resetStatus = useResetAtom(activeWorkloadStatusAtom);
  const resetIsMine = useResetAtom(activeWorkloadIsMineAtom);

  // 마운트 시 atom 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 목적
  useEffect(() => {
    resetPage();
    resetSort();
    resetSearchText();
    resetJobType();
    resetStatus();
    resetIsMine();
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
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    ...(jobType && { workloadJobType: jobType }),
    ...(status && { workloadStatus: status }),
    ...(sortRequest || ACTIVE_WORKLOAD_DEFAULT_SORT),
    ...(isMine && { isMine }),
  };

  const { data, isLoading, isError } = useGetActiveWorkloadsWithPolling({
    workspaceId: workspaceId ?? 0,
    params,
    enabled: Boolean(workspaceId),
  });

  return (
    <>
      {/* 워크로드 목록 필터 */}
      <ActiveWorkloadListFilter
        total={data?.totalSize ?? 0}
        loading={isLoading}
      />
      {/* 워크로드 목록 본문 */}
      <ActiveWorkloadListBody
        content={data?.content ?? []}
        loading={isLoading}
        isError={isError}
      />
      {/* 워크로드 목록 페이지네이션 */}
      <ActiveWorkloadListFooter
        total={data?.totalSize ?? 0}
        loading={isLoading}
      />
    </>
  );
}
