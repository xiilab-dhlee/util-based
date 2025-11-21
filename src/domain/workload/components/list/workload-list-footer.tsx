"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetWorkloadsByMode } from "@/domain/workload/hooks/use-get-workloads-by-mode";
import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 워크로드 목록 페이지 하단 푸터 컴포넌트
 *
 * 워크로드 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 워크로드 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 워크로드 목록 페이지 하단 푸터 컴포넌트
 */
export function WorkloadListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(workloadPageAtom);
  // 검색어
  const searchText = useAtomValue(workloadSearchTextAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetWorkloadsByMode({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
