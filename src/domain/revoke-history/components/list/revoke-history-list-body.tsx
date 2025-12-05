"use client";

import { useAtomValue } from "jotai";

import { createRevokeHistoryColumn } from "@/domain/revoke-history/components/column/create-revoke-history-column";
import { useGetRevokeHistories } from "@/domain/revoke-history/hooks/use-get-revoke-histories";
import type { RevokeHistoryItemResponseType } from "@/domain/revoke-history/schemas/revoke-history.schema";
import {
  revokeHistoryEndDateAtom,
  revokeHistoryPageAtom,
  revokeHistoryStartDateAtom,
} from "@/domain/revoke-history/state/revoke-history.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 리소스 회수 이력 목록 테이블 컴포넌트
 */
export function RevokeHistoryListBody() {
  const page = useAtomValue(revokeHistoryPageAtom);
  const startDate = useAtomValue(revokeHistoryStartDateAtom);
  const endDate = useAtomValue(revokeHistoryEndDateAtom);

  const { data, isError, isLoading } = useGetRevokeHistories({
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return (
    <ListWrapper>
      <CustomizedTable<RevokeHistoryItemResponseType>
        columns={createRevokeHistoryColumn()}
        data={data?.content || []}
        columnHeight={40}
        activePadding
        isError={isError}
        loading={isLoading}
      />
    </ListWrapper>
  );
}
