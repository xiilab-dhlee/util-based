"use client";

import { useAtom } from "jotai";

import { revokeHistoryDetailPageAtom } from "@/domain/revoke/state/revoke-history.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RevokeHistoryDetailFooterProps {
  totalSize: number;
  isLoading: boolean;
}

/**
 * 리소스 회수 이력 상세 페이지네이션 컴포넌트
 */
export function RevokeHistoryDetailFooter({
  totalSize,
  isLoading,
}: RevokeHistoryDetailFooterProps) {
  const [page, setPage] = useAtom(revokeHistoryDetailPageAtom);

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
