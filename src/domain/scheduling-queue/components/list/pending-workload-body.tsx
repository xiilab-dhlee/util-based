"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createPendingWorkloadColumn } from "@/domain/scheduling-queue/columns/create-pending-workload-column";
import {
  PENDING_WORKLOAD_SORT_FIELDS,
  type PendingWorkloadSortField,
} from "@/domain/scheduling-queue/constants/scheduling-queue.constant";
import {
  pendingWorkloadPageAtom,
  pendingWorkloadSortAtom,
} from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { usePeriodicUpdate } from "@/shared/hooks/use-periodic-update";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface PendingWorkloadBodyProps {
  /** 대기중인 워크로드 목록 데이터 */
  data: AdminWorkloadResponse[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  isError: boolean;
  /** 긴급 대기열 추가 핸들러 */
  onAddToUrgentQueue: (workload: AdminWorkloadResponse) => void;
  /** 긴급 대기열 추가 중 상태 */
  isAddingToQueue?: boolean;
  /** 긴급 대기열이 가득 찼는지 여부 (최대 5개) */
  isQueueFull?: boolean;
}

/**
 * 대기중인 워크로드 목록 테이블 본문 컴포넌트
 *
 * 대기중인 워크로드 데이터를 테이블 형태로 렌더링합니다.
 */
export function PendingWorkloadBody({
  data,
  isLoading,
  isError,
  onAddToUrgentQueue,
  isAddingToQueue,
  isQueueFull,
}: PendingWorkloadBodyProps) {
  const [sort, setSort] = useAtom(pendingWorkloadSortAtom);
  const resetPage = useResetAtom(pendingWorkloadPageAtom);

  const handleChange: TableProps<AdminWorkloadResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      AdminWorkloadResponse,
      PendingWorkloadSortField
    >(sorter, PENDING_WORKLOAD_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    resetPage();
    setSort(parsed);
  };

  // 대기 시간 컬럼 갱신을 위해 주기적으로 리렌더링
  usePeriodicUpdate(60000);

  return (
    <ListWrapper>
      <CustomizedTable<AdminWorkloadResponse>
        columns={createPendingWorkloadColumn({
          onAddToUrgentQueue,
          isAddingToQueue,
          isQueueFull,
          sort,
        })}
        data={data}
        rowKey="workloadResourceName"
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        activePadding
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
