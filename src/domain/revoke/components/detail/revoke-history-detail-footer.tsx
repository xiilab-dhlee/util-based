"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetRevokeHistoryDetail } from "@/domain/revoke/hooks/use-get-revoke-history-detail";
import {
  revokeHistoryDetailEndDateAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailStartDateAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RevokeHistoryDetailFooterProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 페이지네이션 컴포넌트
 */
export function RevokeHistoryDetailFooter({
  id,
}: RevokeHistoryDetailFooterProps) {
  const [page, setPage] = useAtom(revokeHistoryDetailPageAtom);
  const startDate = useAtomValue(revokeHistoryDetailStartDateAtom);
  const endDate = useAtomValue(revokeHistoryDetailEndDateAtom);
  const type = useAtomValue(revokeHistoryDetailTypeAtom);

  const { data, isLoading } = useGetRevokeHistoryDetail(id, {
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={data?.totalSize ?? 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
