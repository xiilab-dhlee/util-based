"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetRevokeHistories } from "@/domain/revoke-history/hooks/use-get-revoke-histories";
import {
  revokeHistoryEndDateAtom,
  revokeHistoryPageAtom,
  revokeHistoryStartDateAtom,
} from "@/domain/revoke-history/state/revoke-history.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 리소스 회수 이력 목록 페이지네이션 컴포넌트
 */
export function RevokeHistoryListFooter() {
  const [page, setPage] = useAtom(revokeHistoryPageAtom);
  const startDate = useAtomValue(revokeHistoryStartDateAtom);
  const endDate = useAtomValue(revokeHistoryEndDateAtom);

  const { data, isLoading } = useGetRevokeHistories({
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
