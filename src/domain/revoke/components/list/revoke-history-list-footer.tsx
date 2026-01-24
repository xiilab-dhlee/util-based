"use client";

import { useAtom } from "jotai";

import { revokeHistoryPageAtom } from "@/domain/revoke/state/revoke-history.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RevokeHistoryListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

/**
 * 리소스 회수 이력 목록 페이지네이션 컴포넌트
 */
export function RevokeHistoryListFooter({
  totalSize,
  isLoading,
}: RevokeHistoryListFooterProps) {
  const [page, setPage] = useAtom(revokeHistoryPageAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
