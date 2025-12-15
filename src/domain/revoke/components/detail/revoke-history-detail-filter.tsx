"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { REVOKE_HISTORY_TYPE_OPTIONS } from "@/domain/revoke/constants/revoke-history.constant";
import { useGetRevokeHistoryDetail } from "@/domain/revoke/hooks/use-get-revoke-history-detail";
import {
  revokeHistoryDetailEndDateAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailStartDateAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import type { FilterRevokeHistoryDetailType } from "@/domain/revoke/types/revoke-history.type";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RevokeHistoryDetailFilterProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 필터 컴포넌트
 *
 * 기간 필터와 구분(경고/회수) 필터를 제공합니다.
 */
export function RevokeHistoryDetailFilter({
  id,
}: RevokeHistoryDetailFilterProps) {
  const [page] = useAtom(revokeHistoryDetailPageAtom);
  const [startDate, setStartDate] = useAtom(revokeHistoryDetailStartDateAtom);
  const [endDate, setEndDate] = useAtom(revokeHistoryDetailEndDateAtom);
  const [typeValue, setTypeValue] = useAtom(revokeHistoryDetailTypeAtom);
  const resetPage = useResetAtom(revokeHistoryDetailPageAtom);

  const { data } = useGetRevokeHistoryDetail(id, {
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type: typeValue,
  });

  const total = data?.totalSize ?? 0;

  const typeOptions = [ALL_OPTION, ...REVOKE_HISTORY_TYPE_OPTIONS];

  /**
   * 구분(경고/회수) 변경 핸들러
   * 구분 변경 시 페이지를 초기화
   */
  const handleTypeChange = (value: FilterRevokeHistoryDetailType) => {
    resetPage();
    setTypeValue(value);
  };

  /**
   * 날짜 범위 변경 핸들러
   * 날짜 변경 시 페이지를 초기화
   */
  const handleDateChange = (start: string, end: string) => {
    resetPage();
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <MySearchFilter title="경고 및 회수 목록" total={total}>
      <FilterControls>
        <ListRangePicker
          startDate={startDate}
          endDate={endDate}
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
