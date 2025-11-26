"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Dropdown, Typography } from "xiilab-ui";

import { SystemMonitoringChartList } from "@/domain/system-monitoring/components/system-monitoring-chart-list";
import { SystemMonitoringSummary } from "@/domain/system-monitoring/components/system-monitoring-summary";
import { useGpuFilter } from "@/domain/system-monitoring/hooks/use-gpu-filter.hook";
import { useNodeSummary } from "@/domain/system-monitoring/hooks/use-system-monitoring.hook";
import { MOCK_NODE_OPTIONS } from "@/domain/system-monitoring/mocks/system-monitoring.mock";
import {
  buildResourceSummary,
  normalizeMonitoringHistoryRange,
} from "@/domain/system-monitoring/utils/system-monitoring.util";
import { ChartDateRange } from "@/shared/components/chart-date-range";
import { PageHeader } from "@/shared/components/layouts/page-header";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

export function SystemMonitoringMain() {
  // 노드 관련 State
  const [selectedNode, setSelectedNode] = useState<string>(
    MOCK_NODE_OPTIONS[0].value,
  );

  // 날짜 모드 및 범위 State
  const [dateMode, setDateMode] = useState<MonitoringDateMode>("live");

  const initialHistoryRange = useMemo(
    () => ({
      // 기본 history 기간: 7일
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
    [],
  );
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(
    initialHistoryRange,
  );

  const handleChangeNode = (value: string | null) => {
    if (!value) return;
    setSelectedNode(value);
  };

  const handleChangeGpu = (value: string | null) => {
    if (!value) return;
    setSelectedGpu(value);
  };

  const handleToggleDateMode = () => {
    setDateMode((prev) => (prev === "live" ? "history" : "live"));
  };

  const handleChangeDateRange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    if (!startDate || !endDate) return;
    // live 모드에서는 수동 선택을 반영하지 않음
    if (dateMode === "live") return;

    const normalizedRange = normalizeMonitoringHistoryRange({
      start: startDate,
      end: endDate,
    });

    setDateRange(normalizedRange);
  };

  const handleChangeRangeFromChart = (range: { start: Date; end: Date }) => {
    // LIVE 모드에서 차트 드래그 시 history 모드로 전환
    setDateMode((prevMode) => {
      if (prevMode === "live") {
        return "history";
      }
      return prevMode;
    });

    const normalizedRange = normalizeMonitoringHistoryRange(range);
    setDateRange(normalizedRange);
  };

  // React Query를 사용한 노드 요약 정보 조회
  const { data: nodeSummaryData } = useNodeSummary(selectedNode);
  const nodeSummary = nodeSummaryData?.data;

  // 리소스 요약 정보 생성
  const resourceSummary = buildResourceSummary(nodeSummary);

  // GPU 필터 관리
  const { selectedGpu, setSelectedGpu, gpuOptions, selectedGpuFilter } =
    useGpuFilter(nodeSummary);

  return (
    <>
      <PageHeader
        pageKey="admin.system-monitoring"
        description="System monitoring"
      />
      <Container>
        <ArticleHeader>
          <Typography.Text variant="title-2">
            시스템 모니터링 정보
          </Typography.Text>
          <ArticleHeaderRight>
            <SelectLabel>노드 목록</SelectLabel>
            <Dropdown
              options={MOCK_NODE_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              onChange={handleChangeNode}
              value={selectedNode}
              width={160}
              height={30}
            />
          </ArticleHeaderRight>
        </ArticleHeader>
        {/* 시스템 모니터링 정보 */}
        <SystemMonitoringSummary
          nodeSummary={nodeSummary}
          selectedNode={selectedNode}
          resourceSummary={resourceSummary}
        />
        <ArticleHeader>
          <Typography.Text variant="title-2">그래프</Typography.Text>
          <ArticleHeaderRight>
            <Dropdown
              options={gpuOptions}
              onChange={handleChangeGpu}
              value={selectedGpu}
              width={160}
              height={30}
              placeholder="GPU 선택"
            />
            <ChartDateRange
              mode={dateMode}
              value={dateRange}
              onToggleMode={handleToggleDateMode}
              onChangeRange={handleChangeDateRange}
              height={30}
              width={250}
              withTime
              maxDate={new Date()}
            />
          </ArticleHeaderRight>
        </ArticleHeader>
        <SystemMonitoringChartList
          nodeName={selectedNode}
          dateRange={dateRange}
          selectedGpu={selectedGpuFilter}
          mode={dateMode}
          onChangeRangeFromChart={handleChangeRangeFromChart}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 24px 26px;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;

  ${hideScrollbar}
`;

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

const SelectLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;
