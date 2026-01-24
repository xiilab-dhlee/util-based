"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { REVOKE_HISTORY_TYPE_OPTIONS } from "@/domain/revoke/constants/revoke-history.constant";
import {
  revokeHistoryDetailDateRangeAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import type { RevokeHistoryDetailType } from "@/domain/revoke/types/revoke-history.type";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface RevokeHistoryDetailFilterProps {
  totalSize: number;
}

/**
 * 리소스 회수 이력 상세 필터 컴포넌트
 *
 * 기간 필터와 구분(경고/회수) 필터를 제공합니다.
 */
export function RevokeHistoryDetailFilter({
  totalSize,
}: RevokeHistoryDetailFilterProps) {
  const [dateRange, setDateRange] = useAtom(revokeHistoryDetailDateRangeAtom);
  const [typeValue, setTypeValue] = useAtom(revokeHistoryDetailTypeAtom);
  const resetPage = useResetAtom(revokeHistoryDetailPageAtom);

  const typeOptions = [ALL_OPTION, ...REVOKE_HISTORY_TYPE_OPTIONS];

  /**
   * 구분(경고/회수) 변경 핸들러
   * 구분 변경 시 페이지를 초기화
   */
  const handleTypeChange = (value: string) => {
    resetPage();
    // 빈 문자열(전체)이면 undefined로 설정
    setTypeValue(value === "" ? undefined : (value as RevokeHistoryDetailType));
  };

  /**
   * 날짜 범위 변경 핸들러
   * 날짜 변경 시 페이지를 초기화
   */
  const handleDateChange = (start: string, end: string) => {
    resetPage();
    setDateRange({ start, end });
  };

  return (
    <MySearchFilter title="경고 및 회수 목록" total={totalSize}>
      <FilterControls>
        <ListRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={handleDateChange}
        />
        <Dropdown
          options={typeOptions}
          value={typeValue ?? ALL_OPTION.value}
          onChange={handleTypeChange}
          placeholder="구분"
          width={120}
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
