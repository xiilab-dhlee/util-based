"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useGetUrgentStandbyWorkloads } from "@/api/generated/admin-queue/admin-queue";
import { useGetPendingWorkloads } from "@/api/generated/admin-workload/admin-workload";
import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PendingWorkloadBody } from "@/domain/scheduling-queue/components/list/pending-workload-body";
import { PendingWorkloadFilter } from "@/domain/scheduling-queue/components/list/pending-workload-filter";
import { PendingWorkloadFooter } from "@/domain/scheduling-queue/components/list/pending-workload-footer";
import {
  MAX_URGENT_QUEUE_SIZE,
  PENDING_WORKLOAD_SORT_FIELD_MAP,
} from "@/domain/scheduling-queue/constants/scheduling-queue.constant";
import {
  pendingWorkloadJobTypeAtom,
  pendingWorkloadPageAtom,
  pendingWorkloadSearchAtom,
  pendingWorkloadSortAtom,
} from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { buildSortRequest } from "@/shared/utils/sort.util";

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
  const sort = useAtomValue(pendingWorkloadSortAtom);

  const resetJobType = useResetAtom(pendingWorkloadJobTypeAtom);
  const resetSearch = useResetAtom(pendingWorkloadSearchAtom);
  const resetPage = useResetAtom(pendingWorkloadPageAtom);
  const resetSort = useResetAtom(pendingWorkloadSortAtom);

  const filterRequest = jobType ? { jobType } : {};
  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: PENDING_WORKLOAD_SORT_FIELD_MAP,
  });

  const {
    data: pendingData,
    isLoading,
    isError,
  } = useGetPendingWorkloads({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: search || undefined,
    ...(sortRequest ?? {}),
    ...filterRequest,
  });

  // 긴급 대기열 데이터 조회 (최대 개수 제한 확인용)
  const { data: urgentData } = useGetUrgentStandbyWorkloads();
  const isQueueFull = (urgentData?.length ?? 0) >= MAX_URGENT_QUEUE_SIZE;

  /**
   * 긴급 대기열에 워크로드 추가 - 확인 모달 열기
   */
  const handleAddToUrgentQueue = (workload: AdminWorkloadResponse) => {
    if (isQueueFull) {
      toast.warning(
        `긴급 큐는 최대 ${MAX_URGENT_QUEUE_SIZE}개까지 추가할 수 있어요.`,
      );
      return;
    }

    pubsubUtil.publish(SCHEDULING_QUEUE_EVENTS.openAddToQueueConfirmModal, {
      workload,
    });
  };

  const totalSize = pendingData?.totalSize || 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트시 초기화
  useEffect(() => {
    resetJobType();
    resetSearch();
    resetPage();
    resetSort();
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
        isQueueFull={isQueueFull}
      />
      {/* 대기중인 워크로드 목록 페이지네이션 */}
      <PendingWorkloadFooter total={totalSize} isLoading={isLoading} />
    </>
  );
}
