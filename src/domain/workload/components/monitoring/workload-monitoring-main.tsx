"use client";

import styled from "styled-components";

import { useSeriesVisibility } from "@/domain/system-monitoring/hooks/use-series-visibility.hook";
import { ViewWorkloadMonitoringModal } from "@/domain/workload/components/detail/view-workload-monitoring-modal";
import { WorkloadMonitoringCard } from "@/domain/workload/components/detail/workload-monitoring-card";
import { MonitoringToolbar } from "@/domain/workload/components/monitoring/monitoring-toolbar";
import { useWorkloadMonitoringData } from "@/domain/workload/hooks/use-workload-monitoring-data.hook";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

export function WorkloadMonitoringMain() {
  const {
    data,
    isLoading,
    errors,
    dateState,
    isValid,
    workloadResourceName,
    isTerminated,
  } = useWorkloadMonitoringData();

  // 1. 시리즈 가시성 관리 (Legend 클릭으로 GPU 필터링)
  const { visibilityMap, toggleSeries } = useSeriesVisibility({
    nodeName: workloadResourceName,
  });

  return (
    <>
      {/* 모니터링 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>모니터링</DetailContentTitle>
        <DetailContentTitleTool>
          <MonitoringToolbar
            dateMode={dateState.dateMode}
            dateRange={dateState.dateRange}
            onToggleDateMode={dateState.handleToggleDateMode}
            onChangeDateRange={dateState.handleChangeDateRange}
            isTerminated={isTerminated}
          />
        </DetailContentTitleTool>
      </DetailContentHeader>

      {/* 워크로드 모니터링 내용 */}
      <MonitoringContent>
        {!isValid ? (
          <EmptyState title="워크로드를 찾을 수 없습니다" />
        ) : (
          <MonitoringArticle>
            <ChartGridWrap>
              <ChartCardGridItem>
                <WorkloadMonitoringCard
                  type="gpu-utilization"
                  data={data.gpuUtilization}
                  seriesVisibilityMap={visibilityMap}
                  onSeriesToggle={toggleSeries}
                  isLoading={isLoading}
                  hasError={errors.gpuUtilization}
                  onChangeRange={dateState.handleChangeRangeFromChart}
                />
              </ChartCardGridItem>
              <ChartCardGridItem>
                <WorkloadMonitoringCard
                  type="gpu-memory"
                  data={data.gpuMemUtilization}
                  seriesVisibilityMap={visibilityMap}
                  onSeriesToggle={toggleSeries}
                  isLoading={isLoading}
                  hasError={errors.gpuMemUtilization}
                  onChangeRange={dateState.handleChangeRangeFromChart}
                />
              </ChartCardGridItem>
              <ChartCardGridItem>
                <WorkloadMonitoringCard
                  type="cpu-usage"
                  data={data.cpuUtilization}
                  seriesVisibilityMap={visibilityMap}
                  onSeriesToggle={toggleSeries}
                  isLoading={isLoading}
                  hasError={errors.cpuUtilization}
                  onChangeRange={dateState.handleChangeRangeFromChart}
                />
              </ChartCardGridItem>
              <ChartCardGridItem>
                <WorkloadMonitoringCard
                  type="memory-usage"
                  data={data.memUtilization}
                  seriesVisibilityMap={visibilityMap}
                  onSeriesToggle={toggleSeries}
                  isLoading={isLoading}
                  hasError={errors.memUtilization}
                  onChangeRange={dateState.handleChangeRangeFromChart}
                />
              </ChartCardGridItem>
            </ChartGridWrap>
          </MonitoringArticle>
        )}
      </MonitoringContent>

      {/* 워크로드 모니터링 모달 */}
      <ViewWorkloadMonitoringModal />
    </>
  );
}

const MonitoringContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  overflow: hidden;
`;

const MonitoringArticle = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChartGridWrap = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  overflow: hidden;
`;

const ChartCardGridItem = styled.div`
  grid-row: span 1;
  overflow: hidden;
`;
