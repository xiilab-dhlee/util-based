"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { DisabledWorkloadJobTypeSort } from "@/domain/workload/components/list/disabled-workload-job-type-sort";
import {
  disabledWorkloadPageAtom,
  disabledWorkloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface DisabledWorkloadListFilterProps {
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
export function DisabledWorkloadListFilter({
  total,
  isLoading,
}: DisabledWorkloadListFilterProps) {
  const setSearchText = useSetAtom(disabledWorkloadSearchTextAtom);
  const resetPage = useResetAtom(disabledWorkloadPageAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter
      title="워크로드 목록"
      total={total}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      <MyItemsOnlySwitch checked={false} />
      <DisabledWorkloadJobTypeSort disabled={isLoading} />
      <SearchInput
        disabled={isLoading}
        onSearch={handleSearch}
        testId={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
