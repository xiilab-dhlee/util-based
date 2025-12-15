"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Dropdown } from "xiilab-ui";

import { RESOURCE_PRESET_JOB_OPTIONS } from "@/domain/resource-preset/constants/resource-preset.constant";
import type {
  ResourcePresetJobType,
  ResourcePresetNodeType,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
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
import { useSelect } from "@/shared/hooks/use-select";

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
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  // Job Type 드롭다운
  const jobTypeOptions = [ALL_OPTION, ...RESOURCE_PRESET_JOB_OPTIONS];
  const jobTypeSelect = useSelect(jobType ?? null, jobTypeOptions);

  // Node Type 드롭다운
  const nodeTypeOptions = [ALL_OPTION, ...NODE_MODE_OPTIONS];
  const nodeTypeSelect = useSelect(nodeType ?? null, nodeTypeOptions);

  /** Job Type 변경 핸들러 */
  const handleChangeJobType = (newValue: ResourcePresetJobType | null) => {
    jobTypeSelect.onChange(newValue);
    setJobType(newValue ?? undefined);
  };

  /** Node Type 변경 핸들러 */
  const handleChangeNodeType = (newValue: ResourcePresetNodeType | null) => {
    nodeTypeSelect.onChange(newValue);
    setNodeType(newValue ?? undefined);
  };

  return (
    <MySearchFilter title="리소스 프리셋 목록" total={total}>
      <FilterControls>
        <Dropdown
          options={jobTypeSelect.options}
          value={jobTypeSelect.value}
          onChange={handleChangeJobType}
          placeholder="Job Type"
          width={140}
          disabled={isLoading}
        />
        <Dropdown
          options={nodeTypeSelect.options}
          value={nodeTypeSelect.value}
          onChange={handleChangeNodeType}
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
