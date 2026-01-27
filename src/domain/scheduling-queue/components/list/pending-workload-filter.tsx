"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import styled from "styled-components";
import { Input } from "xiilab-ui";

import {
  pendingWorkloadPageAtom,
  pendingWorkloadSearchAtom,
} from "@/domain/scheduling-queue/state/scheduling-queue.atom";
// import { WORKLOAD_JOB_OPTIONS } from "@/domain/workload/constants/workload.constant";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";

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
  const [, setSearch] = useAtom(pendingWorkloadSearchAtom);
  const resetPage = useResetAtom(pendingWorkloadPageAtom);

  const [localSearchText, setLocalSearchText] = useState("");

  /**
   * 검색 실행 핸들러
   * 검색 시 페이지를 초기화하고 검색어를 atom에 저장
   */
  const handleSearch = () => {
    resetPage();
    setSearch(localSearchText);
  };

  return (
    <MySearchFilter
      title={
        <TooltipWrapper>
          대기 중인 워크로드 목록
          <GuideTooltip
            iconSize={20}
            maxWidth="100%"
            title={
              <>
                워크로드, 워크스페이스, 생성자 이름으로 검색 가능합니다.
                <br />
                대기중 상태인 워크로드만 긴급 대기열에 등록할 수 있으며,
                <br />
                긴급 대기열에 등록된 워크로드가 있는 경우, 그렇지 않은
                워크로드는 실행되지 않습니다.
              </>
            }
          />
        </TooltipWrapper>
      }
      total={total}
    >
      <FilterControls>
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

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
