"use client";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createPendingWorkloadColumn } from "@/domain/scheduling-queue/columns/create-pending-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
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
  return (
    <ListWrapper>
      <CustomizedTable<AdminWorkloadResponse>
        columns={createPendingWorkloadColumn({
          onAddToUrgentQueue,
          isAddingToQueue,
          isQueueFull,
        })}
        data={data}
        rowKey="workloadResourceName"
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        activePadding
      />
    </ListWrapper>
  );
}
