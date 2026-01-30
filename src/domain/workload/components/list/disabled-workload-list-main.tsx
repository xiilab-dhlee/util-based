"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import type { GetTerminatedWorkloadsParams } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DisabledWorkloadListBody } from "@/domain/workload/components/list/disabled-workload-list-body";
import { DisabledWorkloadListFilter } from "@/domain/workload/components/list/disabled-workload-list-filter";
import { DisabledWorkloadListFooter } from "@/domain/workload/components/list/disabled-workload-list-footer";
import {
  DISABLED_WORKLOAD_DEFAULT_SORT,
  DISABLED_WORKLOAD_SORT_FIELD_MAP,
} from "@/domain/workload/constants/workload.constant";
import { useGetTerminatedWorkloadsWithPolling } from "@/domain/workload/hooks/use-get-terminated-workloads-with-polling";
import {
  disabledWorkloadIsMineAtom,
  disabledWorkloadJobTypeAtom,
  disabledWorkloadPageAtom,
  disabledWorkloadSearchTextAtom,
  disabledWorkloadSortAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";

/**
 * 비활성화 워크로드 목록 메인 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 * API endpoint: GET /api/v1/workspaces/{workspaceId}/workloads/terminated
 * 상태: TERMINATING, TERMINATED
 *
 * @returns 비활성화 워크로드 목록 메인 컴포넌트
 */
export function DisabledWorkloadListMain() {
  const page = useAtomValue(disabledWorkloadPageAtom);
  const searchText = useAtomValue(disabledWorkloadSearchTextAtom);
  const jobType = useAtomValue(disabledWorkloadJobTypeAtom);
  const sort = useAtomValue(disabledWorkloadSortAtom);
  const hasMine = useAtomValue(disabledWorkloadIsMineAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const resetPage = useResetAtom(disabledWorkloadPageAtom);
  const resetSort = useResetAtom(disabledWorkloadSortAtom);
  const resetSearchText = useResetAtom(disabledWorkloadSearchTextAtom);
  const resetJobType = useResetAtom(disabledWorkloadJobTypeAtom);

  // 마운트 시 atom 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 목적
  useEffect(() => {
    resetPage();
    resetSort();
    resetSearchText();
    resetJobType();
  }, []);

  // 정렬 변경 시 페이지 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: 정렬 변경 시 페이지 초기화 목적
  useEffect(() => {
    resetPage();
  }, [sort]);

  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: DISABLED_WORKLOAD_SORT_FIELD_MAP,
  });

  const params: GetTerminatedWorkloadsParams = {
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText || undefined,
    ...(jobType && { workloadJobType: jobType }),
    ...(sortRequest || DISABLED_WORKLOAD_DEFAULT_SORT),
    hasMine,
  };

  const { data, isLoading, isError } = useGetTerminatedWorkloadsWithPolling({
    workspaceId: workspaceId ?? 0,
    params,
    enabled: Boolean(workspaceId),
  });

  const totalSize = data?.totalSize ?? 0;
  return (
    <>
      {/* 비활성화 워크로드 목록 필터 */}
      <DisabledWorkloadListFilter total={totalSize} isLoading={isLoading} />
      {/* 비활성화 워크로드 목록 본문 */}
      <DisabledWorkloadListBody
        content={data?.content ?? []}
        loading={isLoading}
        isError={isError}
      />
      {/* 비활성화 워크로드 목록 페이지네이션 */}
      <DisabledWorkloadListFooter total={totalSize} isLoading={isLoading} />
    </>
  );
}
