"use client";

import { useAtomValue } from "jotai";

import { createRevokeHistoryDetailColumn } from "@/domain/revoke-history/components/column/create-revoke-history-detail-column";
import { useGetRevokeHistoryDetail } from "@/domain/revoke-history/hooks/use-get-revoke-history-detail";
import type { RevokeHistoryDetailItemType } from "@/domain/revoke-history/schemas/revoke-history.schema";
import {
  revokeHistoryDetailEndDateAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailStartDateAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke-history/state/revoke-history.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RevokeHistoryDetailBodyProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 테이블 컴포넌트
 *
 * 경고/회수 목록을 테이블로 표시합니다.
 */
export function RevokeHistoryDetailBody({ id }: RevokeHistoryDetailBodyProps) {
  const page = useAtomValue(revokeHistoryDetailPageAtom);
  const startDate = useAtomValue(revokeHistoryDetailStartDateAtom);
  const endDate = useAtomValue(revokeHistoryDetailEndDateAtom);
  const type = useAtomValue(revokeHistoryDetailTypeAtom);

  const { data, isError, isLoading } = useGetRevokeHistoryDetail(id, {
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type,
  });

  return (
    <ListWrapper>
      <CustomizedTable<RevokeHistoryDetailItemType>
        columns={createRevokeHistoryDetailColumn()}
        data={data?.content ?? []}
        columnHeight={40}
        activePadding
        isError={isError}
        loading={isLoading}
      />
    </ListWrapper>
  );
}
