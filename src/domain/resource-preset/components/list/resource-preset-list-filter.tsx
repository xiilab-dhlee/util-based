"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Dropdown } from "xiilab-ui";

import { RESOURCE_PRESET_JOB_OPTIONS } from "@/domain/resource-preset/constants/resource-preset.constant";
import {
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetPageAtom,
  resourcePresetSearchTextAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import {
  ALL_OPTION,
  NODE_MODE_OPTIONS,
} from "@/shared/constants/core.constant";

interface ResourcePresetListFilterProps {
  /** 전체 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 추가 버튼 클릭 핸들러 */
  onClickAdd?: () => void;
}

/**
 * 리소스 프리셋 목록 페이지 상단 필터 컴포넌트
 *
 * Job Type, Node Type 필터와 검색어 입력, 추가 버튼을 제공합니다.
 */
export function ResourcePresetListFilter({
  total,
  isLoading,
  onClickAdd,
}: ResourcePresetListFilterProps) {
  const [jobType, setJobType] = useAtom(resourcePresetJobTypeAtom);
  const [nodeType, setNodeType] = useAtom(resourcePresetNodeTypeAtom);
  const setSearchText = useSetAtom(resourcePresetSearchTextAtom);
  const resetPage = useResetAtom(resourcePresetPageAtom);

  /**
   * Job Type 변경 핸들러
   */
  const handleChangeJobType = (value: typeof jobType) => {
    resetPage();
    setJobType(value);
  };

  /**
   * Node Type 변경 핸들러
   */
  const handleChangeNodeType = (value: typeof nodeType) => {
    resetPage();
    setNodeType(value);
  };

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  // 드롭다운 옵션
  const jobTypeOptions = [ALL_OPTION, ...RESOURCE_PRESET_JOB_OPTIONS];
  const nodeTypeOptions = [ALL_OPTION, ...NODE_MODE_OPTIONS];

  return (
    <MySearchFilter title="리소스 프리셋 목록" total={total}>
      <FilterControls>
        <Dropdown
          options={jobTypeOptions}
          value={jobType ?? null}
          onChange={(newValue) => handleChangeJobType(newValue ?? undefined)}
          placeholder="Job Type"
          width={140}
          disabled={isLoading}
        />
        <Dropdown
          options={nodeTypeOptions}
          value={nodeType ?? null}
          onChange={(newValue) => handleChangeNodeType(newValue ?? undefined)}
          placeholder="노드 Type"
          width={140}
          disabled={isLoading}
        />
        <SearchInput
          width={250}
          disabled={isLoading}
          placeholder="리소스 프리셋 이름을 검색해 주세요."
          onSearch={handleSearch}
        />
        <Button
          color="primary"
          icon="Plus"
          iconPosition="left"
          variant="gradient"
          width={146}
          height={30}
          onClick={onClickAdd}
          disabled={isLoading}
        >
          리소스 프리셋 추가
        </Button>
      </FilterControls>
    </MySearchFilter>
  );
}

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
