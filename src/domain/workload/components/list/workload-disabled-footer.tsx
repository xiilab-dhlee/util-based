"use client";

import { useAtom } from "jotai";

import { workloadDisabledPageAtom } from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface WorkloadDisabledFooterProps {
  /** 전체 워크로드 수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 비활성화 워크로드 목록 페이지 하단 푸터 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지에서 페이지 번호를 관리하고,
 * 총 비활성화 워크로드 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 전체 워크로드 수
 * @param isLoading - 로딩 상태
 * @returns 비활성화 워크로드 목록 페이지 하단 푸터 컴포넌트
 */
export function WorkloadDisabledFooter({
  total,
  isLoading,
}: WorkloadDisabledFooterProps) {
  const [page, setPage] = useAtom(workloadDisabledPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={isLoading}
    />
  );
}
