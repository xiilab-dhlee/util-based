"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { WorkloadJobTypeSort } from "@/domain/workload/components/list/workload-job-type-sort";
import { WorkloadStatusSort } from "@/domain/workload/components/list/workload-status-sort";
import {
  workloadPageAtom,
  workloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface WorkloadListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 워크로드 목록 필터 컴포넌트 (관리자용)
 *
 * 워크스페이스 상세 페이지에서 워크로드를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 */
export function WorkloadListFilter({
  total,
  loading,
}: WorkloadListFilterProps) {
  const setSearchText = useSetAtom(workloadSearchTextAtom);
  const resetPage = useResetAtom(workloadPageAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="워크로드 목록" total={total}>
      <WorkloadJobTypeSort disabled={loading} />
      <WorkloadStatusSort disabled={loading} />
      <SearchInput disabled={loading} onSearch={handleSearch} />
    </MySearchFilter>
  );
}
