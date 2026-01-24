"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { Dropdown, Typography } from "xiilab-ui";

import { useGetNodeNames } from "@/api/generated/admin-cluster/admin-cluster";
import { SystemMonitoringChartList } from "@/domain/system-monitoring/components/system-monitoring-chart-list";
import { SystemMonitoringSummary } from "@/domain/system-monitoring/components/system-monitoring-summary";
import { useAllGpuMetrics } from "@/domain/system-monitoring/hooks/use-all-gpu-metrics.hook";
import { useAllGpuMetricsStream } from "@/domain/system-monitoring/hooks/use-all-gpu-metrics-stream.hook";
import { useAllSystemMetrics } from "@/domain/system-monitoring/hooks/use-all-system-metrics.hook";
import { useAllSystemMetricsStream } from "@/domain/system-monitoring/hooks/use-all-system-metrics-stream.hook";
import { useDateRangeMode } from "@/domain/system-monitoring/hooks/use-date-range-mode.hook";
import { useGpuFilter } from "@/domain/system-monitoring/hooks/use-gpu-filter.hook";
import { useNodeSelection } from "@/domain/system-monitoring/hooks/use-node-selection.hook";
import { useSeriesVisibility } from "@/domain/system-monitoring/hooks/use-series-visibility.hook";
import { ChartDateRange } from "@/shared/components/chart-date-range";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { MultiSelectWithAll } from "@/shared/components/select";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

export function SystemMonitoringMain() {
  // 노드 목록 API 호출
  const {
    data: nodeNames,
    isLoading: isNodeNamesLoading,
    isError: isNodeNamesError,
  } = useGetNodeNames();

  // 노드 목록 (API 응답 → 드롭다운 옵션 변환)
  const nodeOptions = useMemo(
    () => (nodeNames ?? []).map((name) => ({ value: name, label: name })),
    [nodeNames],
  );

  // 노드 선택 상태 관리
  const { selectedNode, handleChangeNode } = useNodeSelection(nodeOptions);

  // 날짜 모드 및 범위 상태 관리
  const {
    dateMode,
    dateRange,
    isLiveMode,
    apiDateRange,
    isApiReady,
    handleToggleDateMode,
    handleChangeDateRange,
    handleChangeRangeFromChart,
  } = useDateRangeMode();

  // API 활성화 조건
  const apiEnabled = selectedNode !== "" && isApiReady;

  const gpuMetrics = useAllGpuMetrics({
    nodeName: selectedNode,
    dateRange: apiDateRange,
    enabled: apiEnabled,
  });

  const gpuStream = useAllGpuMetricsStream({
    nodeName: selectedNode,
    lastHistoryTimestamp: gpuMetrics.lastTimestamp,
    initialData: gpuMetrics.data,
    enabled:
      isLiveMode &&
      isApiReady &&
      !gpuMetrics.isLoading &&
      gpuMetrics.lastTimestamp !== null,
  });

  const systemMetrics = useAllSystemMetrics({
    nodeName: selectedNode,
    dateRange: apiDateRange,
    enabled: apiEnabled,
  });

  const systemStream = useAllSystemMetricsStream({
    nodeName: selectedNode,
    lastHistoryTimestamp: systemMetrics.lastTimestamp,
    initialData: systemMetrics.data,
    enabled:
      isLiveMode &&
      isApiReady &&
      !systemMetrics.isLoading &&
      systemMetrics.lastTimestamp !== null,
  });

  const gpuData = isLiveMode ? gpuStream.data : gpuMetrics.data;
  const systemData = isLiveMode ? systemStream.data : systemMetrics.data;

  const allGpuData = useMemo(
    () => [
      ...gpuData.utilization,
      ...gpuData.memory,
      ...gpuData.temperature,
      ...gpuData.powerUsage,
    ],
    [gpuData],
  );

  // GPU 필터 관리 (전체 메트릭에서 GPU 옵션 추출)
  const { selectedGpuIndices, setSelectedGpuIndices, gpuOptions } =
    useGpuFilter(allGpuData, selectedNode);

  // 시리즈 가시성 관리 (Legend 필터링)
  const { visibilityMap, toggleSeries } = useSeriesVisibility({
    nodeName: selectedNode,
  });

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
              options={nodeOptions}
              onChange={handleChangeNode}
              value={selectedNode}
              width={160}
              height={30}
              loading={isNodeNamesLoading}
              status={isNodeNamesError ? "load-failed" : "default"}
            />
          </ArticleHeaderRight>
        </ArticleHeader>
        <SystemMonitoringSummary selectedNode={selectedNode} />
        <ArticleHeader>
          <Typography.Text variant="title-2">그래프</Typography.Text>
          <ArticleHeaderRight>
            <MultiSelectWithAll
              options={gpuOptions}
              value={selectedGpuIndices}
              onChange={setSelectedGpuIndices}
              width={200}
              height={30}
              placeholder="GPU 선택"
              allLabel="전체"
            />
            {dateRange && (
              <ChartDateRange
                mode={dateMode}
                value={dateRange}
                onToggleMode={handleToggleDateMode}
                onChangeRange={handleChangeDateRange}
                height={30}
                width={260}
                withTime
              />
            )}
          </ArticleHeaderRight>
        </ArticleHeader>
        <SystemMonitoringChartList
          gpuData={gpuData}
          systemData={systemData}
          gpuIsLoading={gpuMetrics.isLoading}
          systemIsLoading={systemMetrics.isLoading}
          gpuErrors={isLiveMode ? gpuStream.errors : gpuMetrics.errors}
          systemErrors={isLiveMode ? systemStream.errors : systemMetrics.errors}
          selectedGpuIndices={selectedGpuIndices}
          seriesVisibilityMap={visibilityMap}
          onSeriesToggle={toggleSeries}
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
