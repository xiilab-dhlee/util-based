"use client";

import type { WorkloadReclaimScanResultResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRevokeHistoryDetailColumn } from "@/domain/revoke/components/column/create-revoke-history-detail-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RevokeHistoryDetailBodyProps {
  content: WorkloadReclaimScanResultResponse[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 리소스 회수 이력 상세 테이블 컴포넌트
 *
 * 경고/회수 목록을 테이블로 표시합니다.
 */
export function RevokeHistoryDetailBody({
  content,
  isLoading,
  isError,
}: RevokeHistoryDetailBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable<WorkloadReclaimScanResultResponse>
        columns={createRevokeHistoryDetailColumn()}
        data={content}
        columnHeight={40}
        activePadding
        isError={isError}
        loading={isLoading}
      />
    </ListWrapper>
  );
}
