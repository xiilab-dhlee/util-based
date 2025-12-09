"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { WorkloadListBody } from "@/domain/workload/components/list/workload-list-body";
import { WorkloadListFilter } from "@/domain/workload/components/list/workload-list-filter";
import { WorkloadListFooter } from "@/domain/workload/components/list/workload-list-footer";
import {
  workloadJobTypeAtom,
  workloadPageAtom,
  workloadSearchTextAtom,
  workloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useGetWorkloadsByMode } from "../../hooks/use-get-workloads-by-mode";

/**
 * 워크로드 목록 메인 컴포넌트 (관리자용)
 *
 * 워크스페이스 상세 페이지에서 워크로드 목록을 표시합니다.
 * Main 컴포넌트에서 API를 호출하고, 하위 컴포넌트에 props로 데이터를 전달합니다.
 */
export function WorkloadListMain() {
  const { id } = useParams<{ id: string }>();

  const page = useAtomValue(workloadPageAtom);
  const searchText = useAtomValue(workloadSearchTextAtom);
  const jobType = useAtomValue(workloadJobTypeAtom);
  const status = useAtomValue(workloadStatusAtom);

  const { data, isLoading } = useGetWorkloadsByMode({
    workspaceId: id,
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
