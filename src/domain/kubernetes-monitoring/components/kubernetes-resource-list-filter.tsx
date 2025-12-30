"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import {
  kubernetesResourcePageAtom,
  kubernetesResourceSearchTextAtom,
  kubernetesResourceStatusAtom,
  kubernetesSelectedResourceNameAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import {
  KUBERNETES_RESOURCE_FILTER_OPTIONS,
  KUBERNETES_RESOURCE_SEARCH_CONFIG,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";

export function KubernetesResourceListFilter({
  totalSize,
}: {
  totalSize: number;
}) {
  const [selectedResourceName] = useAtom(kubernetesSelectedResourceNameAtom);
  const [status, setStatus] = useAtom(kubernetesResourceStatusAtom);
  const setSearchText = useSetAtom(kubernetesResourceSearchTextAtom);
  const resetPage = useResetAtom(kubernetesResourcePageAtom);

  // 현재 리소스에 대한 필터 설정 가져오기
  const filterConfig = KUBERNETES_RESOURCE_FILTER_OPTIONS[selectedResourceName];
  const searchConfig = KUBERNETES_RESOURCE_SEARCH_CONFIG[selectedResourceName];

  // 필터가 있으면 ALL_OPTION과 함께 드롭다운 옵션 준비
  const statusOptions = filterConfig?.hasFilter
    ? [ALL_OPTION, ...filterConfig.options]
    : [];

  const statusSelect = useSelect(status, statusOptions);

  /**
   * 필터 변경 핸들러
   * 필터 변경 시 페이지를 초기화하고 필터를 적용
   */
  const handleChangeStatus = (value: string | null) => {
    resetPage();
    statusSelect.onChange(value);
    setStatus(value ?? undefined);
  };

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="Namespace 목록" total={totalSize}>
      <FilterControls>
        {/* 조건부로 필터 드롭다운 렌더링 */}
        {filterConfig.hasFilter && (
          <Dropdown
            options={statusSelect.options}
            value={statusSelect.value}
            onChange={handleChangeStatus}
            placeholder={filterConfig.filterLabel || "상태"}
            width={120}
          />
        )}

        <SearchInput
          onSearch={handleSearch}
          placeholder={searchConfig.placeholder}
          width={220}
        />
      </FilterControls>
    </MySearchFilter>
  );
}

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
