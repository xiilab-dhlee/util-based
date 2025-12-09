"use client";

import { useAtom } from "jotai";

import { disabledWorkloadPageAtom } from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface DisabledWorkloadListFooterProps {
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
export function DisabledWorkloadListFooter({
  total,
  isLoading,
}: DisabledWorkloadListFooterProps) {
  const [page, setPage] = useAtom(disabledWorkloadPageAtom);

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
