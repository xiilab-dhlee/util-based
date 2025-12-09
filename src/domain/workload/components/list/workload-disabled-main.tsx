"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { WorkloadDisabledBody } from "@/domain/workload/components/list/workload-disabled-body";
import { WorkloadDisabledFilter } from "@/domain/workload/components/list/workload-disabled-filter";
import { WorkloadDisabledFooter } from "@/domain/workload/components/list/workload-disabled-footer";
import {
  workloadDisabledJobTypeAtom,
  workloadDisabledPageAtom,
  workloadDisabledSearchTextAtom,
  workloadDisabledStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useGetDisabledWorkloads } from "../../hooks/use-get-disabled-workloads";
import { RestartWorkloadModal } from "../restart-workload-modal";

/**
 * 비활성화 워크로드 목록 메인 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 비활성화 워크로드 목록 메인 컴포넌트
 */
export function WorkloadDisabledMain() {
  const page = useAtomValue(workloadDisabledPageAtom);
  const searchText = useAtomValue(workloadDisabledSearchTextAtom);
  const jobType = useAtomValue(workloadDisabledJobTypeAtom);
  const status = useAtomValue(workloadDisabledStatusAtom);

  const { data, isLoading } = useGetDisabledWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: isNull(status) ? undefined : status,
  });

  return (
    <>
      {/* 비활성화 워크로드 목록 필터 */}
      <WorkloadDisabledFilter
        total={data?.totalSize || 0}
        isLoading={isLoading}
      />
      {/* 비활성화 워크로드 목록 본문 */}
      <WorkloadDisabledBody content={data?.content || []} loading={isLoading} />
      {/* 비활성화 워크로드 목록 페이지네이션 */}
      <WorkloadDisabledFooter
        total={data?.totalSize || 0}
        isLoading={isLoading}
      />
      {/* 워크로드 재시작 모달 */}
      <RestartWorkloadModal />
    </>
  );
}
