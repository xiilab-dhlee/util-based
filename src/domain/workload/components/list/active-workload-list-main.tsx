"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { ActiveWorkloadListBody } from "@/domain/workload/components/list/active-workload-list-body";
import { ActiveWorkloadListFilter } from "@/domain/workload/components/list/active-workload-list-filter";
import { ActiveWorkloadListFooter } from "@/domain/workload/components/list/active-workload-list-footer";
import { useGetActiveWorkloads } from "@/domain/workload/hooks/use-get-active-workloads";
import {
  activeWorkloadJobTypeAtom,
  activeWorkloadPageAtom,
  activeWorkloadSearchTextAtom,
  activeWorkloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 활성화 워크로드 목록 메인 컴포넌트
 *
 * 활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 활성화 워크로드 목록 메인 컴포넌트
 */
export function ActiveWorkloadListMain() {
  const page = useAtomValue(activeWorkloadPageAtom);
  const searchText = useAtomValue(activeWorkloadSearchTextAtom);
  const jobType = useAtomValue(activeWorkloadJobTypeAtom);
  const status = useAtomValue(activeWorkloadStatusAtom);

  const { data, isLoading, isError } = useGetActiveWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: isNull(status) || status === ALL_OPTION.value ? undefined : status,
  });

  return (
    <>
      {/* 워크로드 목록 필터 */}
      <ActiveWorkloadListFilter
        total={data?.totalSize || 0}
        loading={isLoading}
      />
      {/* 워크로드 목록 본문 */}
      <ActiveWorkloadListBody
        content={data?.content || []}
        loading={isLoading}
        isError={isError}
      />
      {/* 워크로드 목록 페이지네이션 */}
      <ActiveWorkloadListFooter
        total={data?.totalSize || 0}
        loading={isLoading}
      />
    </>
  );
}
