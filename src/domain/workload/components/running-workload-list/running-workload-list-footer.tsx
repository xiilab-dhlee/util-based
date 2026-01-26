"use client";

import { useAtom } from "jotai";

import { RUNNING_WORKLOAD_PAGE_SIZE } from "@/domain/workload/constants/workload.constant";
import { runningWorkloadPageAtom } from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface RunningWorkloadListFooterProps {
  /** 전체 워크로드 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 실행중(RUNNING) 워크로드 목록 페이지네이션 컴포넌트
 *
 * 워크로드 목록의 페이지네이션을 표시합니다.
 */
export function RunningWorkloadListFooter({
  total,
  loading,
}: RunningWorkloadListFooterProps) {
  const [page, setPage] = useAtom(runningWorkloadPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={RUNNING_WORKLOAD_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
    />
  );
}
