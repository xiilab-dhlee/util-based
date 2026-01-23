"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import styled from "styled-components";
import { Dropdown, Input } from "xiilab-ui";

import type { PendingWorkloadFilterRequestJobType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  pendingWorkloadJobTypeAtom,
  pendingWorkloadPageAtom,
  pendingWorkloadSearchAtom,
} from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { WORKLOAD_JOB_OPTIONS } from "@/domain/workload/constants/workload.constant";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";

interface PendingWorkloadFilterProps {
  /** 대기중인 워크로드 총 개수 */
  total?: number;
}

/**
 * 대기중인 워크로드 목록 필터 컴포넌트
 *
 * Job Type 필터와 검색어 입력을 제공합니다.
 */
export function PendingWorkloadFilter({ total }: PendingWorkloadFilterProps) {
  const [, setJobType] = useAtom(pendingWorkloadJobTypeAtom);
  const [, setSearch] = useAtom(pendingWorkloadSearchAtom);
  const resetPage = useResetAtom(pendingWorkloadPageAtom);

  const [localSearchText, setLocalSearchText] = useState("");

  const jobTypeOptions = [ALL_OPTION, ...WORKLOAD_JOB_OPTIONS];
  const jobTypeSelect = useSelect<string>(null, jobTypeOptions);

  /**
   * Job Type 변경 핸들러
   * Job Type 변경 시 페이지를 초기화
   */
  const handleChangeJobType = (
    newValue: PendingWorkloadFilterRequestJobType | null,
  ) => {
    resetPage();
    jobTypeSelect.onChange(newValue);

    if (!newValue) {
      setJobType(undefined);
      return;
    }

    setJobType(newValue);
  };

  /**
   * 검색 실행 핸들러
   * 검색 시 페이지를 초기화하고 검색어를 atom에 저장
   */
  const handleSearch = () => {
    resetPage();
    setSearch(localSearchText);
  };

  return (
    <MySearchFilter title="대기 중인 워크로드 목록" total={total}>
      <FilterControls>
        <Dropdown
          options={jobTypeSelect.options}
          value={jobTypeSelect.value}
          onChange={handleChangeJobType}
          placeholder="Job Type"
          width={140}
          height={30}
        />
        <Input.Search
          name="search"
          placeholder="검색어를 입력하세요."
          value={localSearchText}
          onChange={(e) => setLocalSearchText(e.target.value)}
          onSearch={handleSearch}
          autoComplete="off"
          width={200}
          height={30}
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
