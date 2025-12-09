"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { WorkloadListBody } from "@/domain/workload/components/list/workload-list-body";
import { WorkloadListFilter } from "@/domain/workload/components/list/workload-list-filter";
import { WorkloadListFooter } from "@/domain/workload/components/list/workload-list-footer";
import { useGetActiveWorkloads } from "@/domain/workload/hooks/use-get-active-workloads";
import {
  workloadJobTypeAtom,
  workloadPageAtom,
  workloadSearchTextAtom,
  workloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 활성화 워크로드 목록 메인 컴포넌트
 *
 * 활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 활성화 워크로드 목록 메인 컴포넌트
 */
export function WorkloadListMain() {
  const page = useAtomValue(workloadPageAtom);
  const searchText = useAtomValue(workloadSearchTextAtom);
  const jobType = useAtomValue(workloadJobTypeAtom);
  const status = useAtomValue(workloadStatusAtom);

  const { data, isLoading } = useGetActiveWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: isNull(status) ? undefined : status,
  });

  return (
    <>
      {/* 워크로드 목록 필터 */}
      <WorkloadListFilter total={data?.totalSize || 0} loading={isLoading} />
      {/* 워크로드 목록 본문 */}
      <WorkloadListBody content={data?.content || []} loading={isLoading} />
      {/* 워크로드 목록 페이지네이션 */}
      <WorkloadListFooter total={data?.totalSize || 0} loading={isLoading} />
    </>
  );
}
