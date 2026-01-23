"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetUrgentStandbyWorkloads } from "@/api/generated/admin-queue/admin-queue";
import { useGetPendingWorkloads } from "@/api/generated/admin-workload/admin-workload";
import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// TODO: AdminWorkloadResponse에 workloadId가 없음 - 백엔드 API 확인 필요
interface AdminWorkloadWithId extends AdminWorkloadResponse {
  workloadId: number;
}

import { PendingWorkloadBody } from "@/domain/scheduling-queue/components/list/pending-workload-body";
import { PendingWorkloadFilter } from "@/domain/scheduling-queue/components/list/pending-workload-filter";
import { PendingWorkloadFooter } from "@/domain/scheduling-queue/components/list/pending-workload-footer";
import { MAX_URGENT_QUEUE_SIZE } from "@/domain/scheduling-queue/constants/scheduling-queue.constant";
import { useAddWorkloadToUrgentStandbyAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import {
  pendingWorkloadJobTypeAtom,
  pendingWorkloadPageAtom,
  pendingWorkloadSearchAtom,
} from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 대기중인 워크로드 목록 메인 컴포넌트
 *
 * 필터, 본문, 페이지네이션을 관리합니다.
 * 데이터 조회를 수행하고 하위 컴포넌트에 데이터를 전달합니다.
 */
export function PendingWorkloadMain() {
  const page = useAtomValue(pendingWorkloadPageAtom);
  const jobType = useAtomValue(pendingWorkloadJobTypeAtom);
  const search = useAtomValue(pendingWorkloadSearchAtom);

  const resetJobType = useResetAtom(pendingWorkloadJobTypeAtom);
  const resetSearch = useResetAtom(pendingWorkloadSearchAtom);
  const resetPage = useResetAtom(pendingWorkloadPageAtom);

  const {
    data: pendingData,
    isLoading,
    isError,
  } = useGetPendingWorkloads({
    pageSearchRequest: {
      pageNo: page - 1,
      pageSize: LIST_PAGE_SIZE,
      keyword: search || undefined,
    },
    filterRequest: {
      jobType: jobType,
    },
  });

  const { mutate: addToUrgentQueue, isPending: isAddingToQueue } =
    useAddWorkloadToUrgentStandbyAction();

  // 긴급 대기열 데이터 조회 (최대 개수 제한 확인용)
  const { data: urgentData } = useGetUrgentStandbyWorkloads();
  const isQueueFull = (urgentData?.length ?? 0) >= MAX_URGENT_QUEUE_SIZE;

  /**
   * 긴급 대기열에 워크로드 추가
   * TODO: AdminWorkloadResponse에 workloadId가 없음 - 백엔드 API 확인 필요
   */
  const handleAddToUrgentQueue = (workload: AdminWorkloadResponse) => {
    const workloadWithId = workload as AdminWorkloadWithId;
    addToUrgentQueue({
      data: {
        workloadId: workloadWithId.workloadId,
      },
    });
  };

  const totalSize = pendingData?.totalSize || 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트시 초기화
  useEffect(() => {
    resetJobType();
    resetSearch();
    resetPage();
  }, []);

  return (
    <>
      {/* 대기중인 워크로드 목록 필터 */}
      <PendingWorkloadFilter total={totalSize} />
      {/* 대기중인 워크로드 목록 본문 */}
      <PendingWorkloadBody
        data={pendingData?.content || []}
        isLoading={isLoading}
        isError={isError}
        onAddToUrgentQueue={handleAddToUrgentQueue}
        isAddingToQueue={isAddingToQueue}
        isQueueFull={isQueueFull}
      />
      {/* 대기중인 워크로드 목록 페이지네이션 */}
      <PendingWorkloadFooter total={totalSize} isLoading={isLoading} />
    </>
  );
}
