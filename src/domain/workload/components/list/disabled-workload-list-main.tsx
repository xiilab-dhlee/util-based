"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { DisabledWorkloadListBody } from "@/domain/workload/components/list/disabled-workload-list-body";
import { DisabledWorkloadListFilter } from "@/domain/workload/components/list/disabled-workload-list-filter";
import { DisabledWorkloadListFooter } from "@/domain/workload/components/list/disabled-workload-list-footer";
import { RestartWorkloadModal } from "@/domain/workload/components/restart-workload-modal";
import { useGetDisabledWorkloads } from "@/domain/workload/hooks/use-get-disabled-workloads";
import {
  disabledWorkloadJobTypeAtom,
  disabledWorkloadPageAtom,
  disabledWorkloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 비활성화 워크로드 목록 메인 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 비활성화 워크로드 목록 메인 컴포넌트
 */
export function DisabledWorkloadListMain() {
  const page = useAtomValue(disabledWorkloadPageAtom);
  const searchText = useAtomValue(disabledWorkloadSearchTextAtom);
  const jobType = useAtomValue(disabledWorkloadJobTypeAtom);

  const { data, isLoading, isError } = useGetDisabledWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: "COMPLETED",
  });

  return (
    <>
      {/* 비활성화 워크로드 목록 필터 */}
      <DisabledWorkloadListFilter
        total={data?.totalSize || 0}
        isLoading={isLoading}
      />
      {/* 비활성화 워크로드 목록 본문 */}
      <DisabledWorkloadListBody
        content={data?.content || []}
        loading={isLoading}
        isError={isError}
      />
      {/* 비활성화 워크로드 목록 페이지네이션 */}
      <DisabledWorkloadListFooter
        total={data?.totalSize || 0}
        isLoading={isLoading}
      />
      {/* 워크로드 재시작 모달 */}
      <RestartWorkloadModal />
    </>
  );
}
