"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { type ChangeEvent, useState } from "react";
import styled from "styled-components";
import { DateRange, Input, Typography } from "xiilab-ui";

import {
  monitoringNotificationHistoryDateRangeAtom,
  monitoringNotificationPageAtom,
  monitoringNotificationSearchTextAtom,
} from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { subTitleStyle } from "@/styles/mixins/text";

interface MonitoringNotificationHistoryListFilterProps {
  loading: boolean;
}

export function MonitoringNotificationHistoryListFilter({
  loading,
}: MonitoringNotificationHistoryListFilterProps) {
  const resetPage = useResetAtom(monitoringNotificationPageAtom);
  const setSearchText = useSetAtom(monitoringNotificationSearchTextAtom);
  const [dateRange, setDateRange] = useAtom(
    monitoringNotificationHistoryDateRangeAtom,
  );

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    if (startDate && endDate) {
      setDateRange({ start: startDate, end: endDate });
    } else {
      setDateRange(null);
    }
    resetPage();
  };

  const handleSearchKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    setSearchText(trimmed);
    setSearchKeyword(trimmed);
    resetPage();
  };

  return (
    <FilterContainer>
      <ArticleTitle variant="subtitle-2">알림 내역</ArticleTitle>
      <FilterControls>
        <DateRange
          height={30}
          width={260}
          startDate={dateRange?.start ?? null}
          endDate={dateRange?.end ?? null}
          withTime
          onChange={handleDateRangeChange}
          maxDate={new Date()}
        />
        <Input.Search
          name="search"
          placeholder="검색어를 입력하세요."
          autoComplete="off"
          width={220}
          height={30}
          value={searchKeyword}
          onChange={handleSearchKeywordChange}
          onSearch={handleSearch}
          disabled={loading}
        />
      </FilterControls>
    </FilterContainer>
  );
}

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const ArticleTitle = styled(Typography.Text)`
  ${subTitleStyle(4)}

  color: #000;
`;
