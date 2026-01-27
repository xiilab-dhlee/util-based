"use client";

import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type {
  SystemMonitoringTabItem,
  SystemMonitoringTabKey,
} from "@/domain/system-monitoring/types/system-monitoring.type";
import { ChartDateRange } from "@/shared/components/chart-date-range";
import { MultiSelectWithAll } from "@/shared/components/select";
import { StateTab } from "@/shared/components/tab";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

interface DateRangeValue {
  start: Date;
  end: Date;
}

interface GpuOption {
  value: string;
  label: string;
}

interface SystemMonitoringFiltersProps {
  tabItems: SystemMonitoringTabItem[];
  activeTab: SystemMonitoringTabKey;
  onChangeTab: Dispatch<SetStateAction<SystemMonitoringTabKey>>;
  isGpuTabActive: boolean;
  gpuOptions: GpuOption[];
  selectedGpuIndices: string[];
  onChangeGpuIndices: Dispatch<SetStateAction<string[]>>;
  dateMode: MonitoringDateMode;
  dateRange: DateRangeValue | null;
  onToggleDateMode: () => void;
  onChangeDateRange: (startDate: Date | null, endDate: Date | null) => void;
}

export function SystemMonitoringFilters({
  tabItems,
  activeTab,
  onChangeTab,
  isGpuTabActive,
  gpuOptions,
  selectedGpuIndices,
  onChangeGpuIndices,
  dateMode,
  dateRange,
  onToggleDateMode,
  onChangeDateRange,
}: SystemMonitoringFiltersProps) {
  const shouldShowDateRange = (
    value: DateRangeValue | null,
  ): value is DateRangeValue => Boolean(value);
  const shouldShowGpuFilter = isGpuTabActive;

  return (
    <>
      <ArticleHeader>
        <Typography.Text variant="title-2">그래프</Typography.Text>
        <ArticleHeaderRight>
          {shouldShowGpuFilter && (
            <MultiSelectWithAll
              options={gpuOptions}
              value={selectedGpuIndices}
              onChange={onChangeGpuIndices}
              width={200}
              height={30}
              placeholder="GPU 선택"
              allLabel="전체"
            />
          )}
          {shouldShowDateRange(dateRange) && (
            <ChartDateRange
              mode={dateMode}
              value={dateRange}
              onToggleMode={onToggleDateMode}
              onChangeRange={onChangeDateRange}
              height={30}
              width={270}
              withTime
            />
          )}
        </ArticleHeaderRight>
      </ArticleHeader>
      <TabWrapper>
        <StateTab<SystemMonitoringTabKey>
          items={tabItems}
          selectedKey={activeTab}
          setSelectedKey={onChangeTab}
        />
      </TabWrapper>
    </>
  );
}

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ArticleHeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const TabWrapper = styled.div`
  margin-bottom: 16px;
`;
