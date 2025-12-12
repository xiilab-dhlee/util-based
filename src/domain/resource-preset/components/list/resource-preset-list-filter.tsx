"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Button, Dropdown } from "xiilab-ui";

import {
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetSearchTextAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { WORKLOAD_JOB_OPTIONS } from "@/domain/workload/constants/workload.constant";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import {
  ALL_OPTION,
  NODE_MODE_OPTIONS,
} from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
import { useSelect } from "@/shared/hooks/use-select";
import type { CoreNodeMode } from "@/shared/types/core.interface";

interface ResourcePresetListFilterProps {
  /** 전체 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 추가 버튼 클릭 핸들러 */
  onClickAdd?: () => void;
}

/**
 * 자원 프리셋 목록 페이지 상단 필터 컴포넌트
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

  const { onSubmit } = useSearch(resourcePresetSearchTextAtom);

  // Job Type 드롭다운
  const jobTypeOptions = [ALL_OPTION, ...WORKLOAD_JOB_OPTIONS];
  const jobTypeSelect = useSelect(jobType ?? null, jobTypeOptions);

  // Node Type 드롭다운
  const nodeTypeOptions = [ALL_OPTION, ...NODE_MODE_OPTIONS];
  const nodeTypeSelect = useSelect(nodeType ?? null, nodeTypeOptions);

  /** Job Type 변경 핸들러 */
  const handleChangeJobType = (newValue: WorkloadJobType | null) => {
    jobTypeSelect.onChange(newValue);
    setJobType(newValue ?? undefined);
  };

  /** Node Type 변경 핸들러 */
  const handleChangeNodeType = (newValue: CoreNodeMode | null) => {
    nodeTypeSelect.onChange(newValue);
    setNodeType(newValue ?? undefined);
  };

  return (
    <MySearchFilter title="자원 프리셋 목록" total={total}>
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
        <form onSubmit={onSubmit}>
          <SearchInput
            width={240}
            disabled={isLoading}
            placeholder="자원 프리셋 이름을 검색해 주세요."
          />
        </form>
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
          자원 프리셋 추가
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
