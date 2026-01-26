"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { WorkloadReclaimScanResultResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRevokeHistoryDetailColumn } from "@/domain/revoke/components/column/create-revoke-history-detail-column";
import {
  REVOKE_HISTORY_DETAIL_SORT_FIELDS,
  type RevokeHistoryDetailSortField,
} from "@/domain/revoke/constants/revoke-history.constant";
import {
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailSortAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
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
  const [sort, setSort] = useAtom(revokeHistoryDetailSortAtom);
  const resetPage = useResetAtom(revokeHistoryDetailPageAtom);

  const handleChange: TableProps<WorkloadReclaimScanResultResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        WorkloadReclaimScanResultResponse,
        RevokeHistoryDetailSortField
      >(sorter, REVOKE_HISTORY_DETAIL_SORT_FIELDS);
      if (!parsed.field || !parsed.order) return;

      resetPage();
      setSort({
        field: parsed.field,
        order: parsed.order,
      });
    };

  return (
    <ListWrapper>
      <CustomizedTable<WorkloadReclaimScanResultResponse>
        columns={createRevokeHistoryDetailColumn(sort)}
        data={content}
        columnHeight={40}
        activePadding
        isError={isError}
        loading={isLoading}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
