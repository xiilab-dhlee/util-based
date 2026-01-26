"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { WorkloadReclaimScanHistoryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRevokeHistoryColumn } from "@/domain/revoke/components/column/create-revoke-history-column";
import {
  REVOKE_HISTORY_LIST_SORT_FIELDS,
  type RevokeHistoryListSortField,
} from "@/domain/revoke/constants/revoke-history.constant";
import {
  revokeHistoryListSortAtom,
  revokeHistoryPageAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
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
  const [sort, setSort] = useAtom(revokeHistoryListSortAtom);
  const resetPage = useResetAtom(revokeHistoryPageAtom);

  const handleChange: TableProps<WorkloadReclaimScanHistoryResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        WorkloadReclaimScanHistoryResponse,
        RevokeHistoryListSortField
      >(sorter, REVOKE_HISTORY_LIST_SORT_FIELDS);
      if (!parsed.field || !parsed.order) return;

      resetPage();
      setSort({
        field: parsed.field,
        order: parsed.order,
      });
    };

  return (
    <ListWrapper>
      <CustomizedTable<WorkloadReclaimScanHistoryResponse>
        columns={createRevokeHistoryColumn(sort)}
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
