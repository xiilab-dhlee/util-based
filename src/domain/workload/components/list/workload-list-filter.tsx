"use client";

import { useAtomValue } from "jotai";

import { WorkloadJobTypeSort } from "@/domain/workload/components/list/workload-job-type-sort";
import { WorkloadStatusSort } from "@/domain/workload/components/list/workload-status-sort";
import { useGetWorkloads } from "@/domain/workload/hooks/use-get-workloads";
import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";

/**
 * 워크로드 목록 페이지 상단 필터 컴포넌트
 *
 * 워크로드 목록 페이지에서 검색어, 작업 유형 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 워크로드 목록 페이지 상단 필터 컴포넌트
 */
export function WorkloadListFilter() {
  const { onSubmit } = useSearch(workloadSearchTextAtom);

  const page = useAtomValue(workloadPageAtom);

  const searchText = useAtomValue(workloadSearchTextAtom);

  const { data } = useGetWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="워크로드 목록" total={data?.totalSize}>
      <WorkloadJobTypeSort />
      <WorkloadStatusSort />
      <form onSubmit={onSubmit} data-testid="workload-list-search-form">
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
