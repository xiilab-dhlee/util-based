"use client";

import { useAtom } from "jotai";

import { workloadPageAtom } from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface WorkloadListFooterProps {
  /** 전체 워크로드 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 워크로드 목록 페이지 하단 푸터 컴포넌트
 *
 * 워크로드 목록 페이지에서 페이지 번호를 관리하고,
 * 총 활성 워크로드 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 * @returns 워크로드 목록 페이지 하단 푸터 컴포넌트
 */
export function WorkloadListFooter({
  total,
  loading,
}: WorkloadListFooterProps) {
  const [page, setPage] = useAtom(workloadPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
    />
  );
}
