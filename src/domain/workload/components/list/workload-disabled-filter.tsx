"use client";

import { WorkloadJobTypeSort } from "@/domain/workload/components/list/workload-job-type-sort";
import { WorkloadStatusSort } from "@/domain/workload/components/list/workload-status-sort";
import { workloadDisabledSearchTextAtom } from "@/domain/workload/state/workload.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

interface WorkloadDisabledFilterProps {
  total: number;
  isLoading: boolean;
}

/**
 * 비활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지에서 검색어, 작업 유형 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param isLoading - 로딩 상태
 * @returns 비활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 */
export function WorkloadDisabledFilter({
  total,
  isLoading,
}: WorkloadDisabledFilterProps) {
  const { onSubmit } = useSearch(workloadDisabledSearchTextAtom);

  return (
    <MySearchFilter title="워크로드 목록" total={total}>
      <WorkloadJobTypeSort disabled={isLoading} />
      <WorkloadStatusSort disabled={isLoading} />
      <form
        onSubmit={onSubmit}
        data-testid="workload-disabled-list-search-form"
      >
        <SearchInput disabled={isLoading} />
      </form>
    </MySearchFilter>
  );
}
