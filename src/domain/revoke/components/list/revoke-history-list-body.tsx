"use client";

import type { WorkloadReclaimScanHistoryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRevokeHistoryColumn } from "@/domain/revoke/components/column/create-revoke-history-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RevokeHistoryListBodyProps {
  content: WorkloadReclaimScanHistoryResponse[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 리소스 회수 이력 목록 테이블 컴포넌트
 */
export function RevokeHistoryListBody({
  content,
  isLoading,
  isError,
}: RevokeHistoryListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable<WorkloadReclaimScanHistoryResponse>
        columns={createRevokeHistoryColumn()}
        data={content}
        columnHeight={40}
        activePadding
        isError={isError}
        loading={isLoading}
      />
    </ListWrapper>
  );
}
