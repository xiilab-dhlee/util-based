"use client";

import { useAtom } from "jotai";

import { pendingWorkloadPageAtom } from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface PendingWorkloadFooterProps {
  /** 대기중인 워크로드 총 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 대기중인 워크로드 목록 페이지 하단 푸터 컴포넌트
 *
 * 페이지네이션을 제공하는 푸터 컴포넌트입니다.
 */
export function PendingWorkloadFooter({
  total,
  isLoading,
}: PendingWorkloadFooterProps) {
  const [page, setPage] = useAtom(pendingWorkloadPageAtom);

  /**
   * 페이지 변경 핸들러
   */
  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
