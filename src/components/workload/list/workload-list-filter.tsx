"use client";

import { useAtomValue } from "jotai";

import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/atoms/workload.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { WorkloadJobTypeSort } from "@/components/workload/list/workload-job-type-sort";
import { WorkloadStatusSort } from "@/components/workload/list/workload-status-sort";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetWorkloads } from "@/hooks/workload/use-get-workloads";
import { MySearchFilter } from "@/layouts/common/search-filter";

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
