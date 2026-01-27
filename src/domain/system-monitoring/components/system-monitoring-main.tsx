"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { Dropdown, Typography } from "xiilab-ui";

import { useGetNodeGpuInfoList } from "@/api/generated/cluster-resource/cluster-resource";
import { SystemMonitoringCharts } from "@/domain/system-monitoring/components/system-monitoring-charts";
import { SystemMonitoringFilters } from "@/domain/system-monitoring/components/system-monitoring-filters";
import { SystemMonitoringSummary } from "@/domain/system-monitoring/components/system-monitoring-summary";
import { useAllGpuMetrics } from "@/domain/system-monitoring/hooks/use-all-gpu-metrics.hook";
import { useAllGpuMetricsStream } from "@/domain/system-monitoring/hooks/use-all-gpu-metrics-stream.hook";
import { useAllSystemMetrics } from "@/domain/system-monitoring/hooks/use-all-system-metrics.hook";
import { useAllSystemMetricsStream } from "@/domain/system-monitoring/hooks/use-all-system-metrics-stream.hook";
import { useDateRangeMode } from "@/domain/system-monitoring/hooks/use-date-range-mode.hook";
import { useGpuFilter } from "@/domain/system-monitoring/hooks/use-gpu-filter.hook";
import { useNodeSelection } from "@/domain/system-monitoring/hooks/use-node-selection.hook";
import { useSeriesVisibility } from "@/domain/system-monitoring/hooks/use-series-visibility.hook";
import type {
  SystemMonitoringTabItem,
  SystemMonitoringTabKey,
} from "@/domain/system-monitoring/types/system-monitoring.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

const TAB_ITEMS: SystemMonitoringTabItem[] = [
  { key: "gpu", label: "GPU" },
  { key: "system", label: "시스템" },
];

export function SystemMonitoringMain() {
  // 노드 목록 API 호출
  const {
    data: nodeGpuInfoList,
    isLoading: isNodeNamesLoading,
    isError: isNodeNamesError,
  } = useGetNodeGpuInfoList();

  // 노드 목록 (API 응답 → 드롭다운 옵션 변환)
  const nodeOptions = useMemo(
    () =>
      (nodeGpuInfoList ?? []).map((node) => ({
        value: node.nodeName,
        label: node.nodeName,
      })),
    [nodeGpuInfoList],
  );

  // 노드 선택 상태 관리
  const { selectedNode, handleChangeNode } = useNodeSelection(nodeOptions);

  const [activeTab, setActiveTab] = useState<SystemMonitoringTabKey>("gpu");

  const selectedNodeInfo = useMemo(
    () => nodeGpuInfoList?.find((node) => node.nodeName === selectedNode),
    [nodeGpuInfoList, selectedNode],
  );

  const isGpuNode = selectedNodeInfo?.isGpuNode ?? false;

  useEffect(() => {
    if (!isGpuNode && activeTab === "gpu") {
      setActiveTab("system");
    }
  }, [activeTab, isGpuNode]);

  const tabItems = useMemo<SystemMonitoringTabItem[]>(
    () =>
      TAB_ITEMS.map((item) =>
        item.key === "gpu" ? { ...item, disabled: !isGpuNode } : item,
      ),
    [isGpuNode],
  );

  const handleChangeTab: Dispatch<SetStateAction<SystemMonitoringTabKey>> = (
    value,
  ) => {
    setActiveTab((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next === "gpu" && !isGpuNode) {
        return prev;
      }
      return next;
    });
  };

  // 날짜 모드 및 범위 상태 관리 (탭별)
  const gpuDate = useDateRangeMode();
  const systemDate = useDateRangeMode();

  const isGpuTabActive = activeTab === "gpu" && isGpuNode;
  const isSystemTabActive = activeTab === "system";

  const activeDateState = isGpuTabActive ? gpuDate : systemDate;

  // API 활성화 조건
  const gpuApiEnabled =
    selectedNode !== "" && isGpuTabActive && gpuDate.isApiReady;
  const systemApiEnabled =
    selectedNode !== "" && isSystemTabActive && systemDate.isApiReady;

  const gpuMetrics = useAllGpuMetrics({
    nodeName: selectedNode,
    dateRange: gpuDate.apiDateRange,
    enabled: gpuApiEnabled,
  });

  const gpuStream = useAllGpuMetricsStream({
    nodeName: selectedNode,
    lastHistoryTimestamp: gpuMetrics.lastTimestamp,
    initialData: gpuMetrics.data,
    enabled:
      isGpuTabActive &&
      gpuDate.isLiveMode &&
      gpuDate.isApiReady &&
      !gpuMetrics.isLoading &&
      gpuMetrics.lastTimestamp !== null,
  });

  const systemMetrics = useAllSystemMetrics({
    nodeName: selectedNode,
    dateRange: systemDate.apiDateRange,
    enabled: systemApiEnabled,
  });

  const systemStream = useAllSystemMetricsStream({
    nodeName: selectedNode,
    lastHistoryTimestamp: systemMetrics.lastTimestamp,
    initialData: systemMetrics.data,
    enabled:
      isSystemTabActive &&
      systemDate.isLiveMode &&
      systemDate.isApiReady &&
      !systemMetrics.isLoading &&
      systemMetrics.lastTimestamp !== null,
  });

  const gpuData = gpuDate.isLiveMode ? gpuStream.data : gpuMetrics.data;
  const systemData = systemDate.isLiveMode
    ? systemStream.data
    : systemMetrics.data;

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
        <SystemMonitoringFilters
          tabItems={tabItems}
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
          isGpuTabActive={isGpuTabActive}
          gpuOptions={gpuOptions}
          selectedGpuIndices={selectedGpuIndices}
          onChangeGpuIndices={setSelectedGpuIndices}
          dateMode={activeDateState.dateMode}
          dateRange={activeDateState.dateRange}
          onToggleDateMode={activeDateState.handleToggleDateMode}
          onChangeDateRange={activeDateState.handleChangeDateRange}
        />
        <SystemMonitoringCharts
          activeTab={activeTab}
          gpuData={gpuData}
          systemData={systemData}
          gpuIsLoading={gpuMetrics.isLoading}
          systemIsLoading={systemMetrics.isLoading}
          gpuErrors={gpuDate.isLiveMode ? gpuStream.errors : gpuMetrics.errors}
          systemErrors={
            systemDate.isLiveMode ? systemStream.errors : systemMetrics.errors
          }
          selectedGpuIndices={selectedGpuIndices}
          seriesVisibilityMap={visibilityMap}
          onSeriesToggle={toggleSeries}
          onChangeRangeFromChart={
            isGpuTabActive
              ? gpuDate.handleChangeRangeFromChart
              : systemDate.handleChangeRangeFromChart
          }
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
