"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { RevokeHistoryJobTypeFilter } from "@/domain/revoke/components/list/revoke-history-job-type-filter";
import {
  revokeHistoryDateRangeAtom,
  revokeHistoryPageAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface RevokeHistoryListFilterProps {
  totalSize: number;
}

/**
 * 리소스 회수 이력 목록 필터 컴포넌트
 *
 * 기간 필터와 총 개수를 표시합니다.
 */
export function RevokeHistoryListFilter({
  totalSize,
}: RevokeHistoryListFilterProps) {
  const [dateRange, setDateRange] = useAtom(revokeHistoryDateRangeAtom);
  const resetPage = useResetAtom(revokeHistoryPageAtom);

  /**
   * 날짜 범위 변경 핸들러
   * 날짜 변경 시 페이지를 초기화
   */
  const handleDateChange = (start: string, end: string) => {
    resetPage();
    setDateRange({ start, end });
  };

  return (
    <MySearchFilter title="리소스 회수 대상 검사 실행 이력" total={totalSize}>
      <RevokeHistoryJobTypeFilter />
      <ListRangePicker
        startDate={dateRange.start}
        endDate={dateRange.end}
        onChange={handleDateChange}
      />
    </MySearchFilter>
  );
}
