"use client";

import { ActiveWorkloadJobTypeSort } from "@/domain/workload/components/list/active-workload-job-type-sort";
import { ActiveWorkloadStatusSort } from "@/domain/workload/components/list/active-workload-status-sort";
import { activeWorkloadSearchTextAtom } from "@/domain/workload/state/workload.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

interface ActiveWorkloadListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 *
 * 활성화 워크로드 목록 페이지에서 검색어, 작업 유형 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 * @returns 활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 */
export function ActiveWorkloadListFilter({
  total,
  loading,
}: ActiveWorkloadListFilterProps) {
  const { onSubmit } = useSearch(activeWorkloadSearchTextAtom);

  return (
    <MySearchFilter title="워크로드 목록" total={total}>
      <ActiveWorkloadJobTypeSort disabled={loading} />
      <ActiveWorkloadStatusSort disabled={loading} />
      <form onSubmit={onSubmit}>
        <SearchInput disabled={loading} />
      </form>
    </MySearchFilter>
  );
}
