"use client";
import styled from "styled-components";

import { ViewWorkloadMonitoringModal } from "@/components/workload/detail/view-workload-monitoring-modal";
import {
  DetailContentHeader,
  DetailContentSubTitle,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { WorkloadMonitoringCard } from "../detail/workload-monitoring-card";
import { MonitoringToolbar } from "./monitoring-toolbar";

export function WorkloadMonitoringMain() {
  return (
    <>
      {/* 모니터링 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>모니터링</DetailContentTitle>
        <DetailContentTitleTool>
          <MonitoringToolbar />
        </DetailContentTitleTool>
      </DetailContentHeader>
      {/* 워크로드 모니터링 내용 */}
      <MonitoringContent>
        <MonitoringArticle>
          <MonitoringSubTitle>Launcher</MonitoringSubTitle>
          <ChartGridWrap>
            <ChartCardGridItem>
              <WorkloadMonitoringCard type="cpu-usage" />
            </ChartCardGridItem>
            <ChartCardGridItem>
              <WorkloadMonitoringCard type="memory-usage" />
            </ChartCardGridItem>
          </ChartGridWrap>
        </MonitoringArticle>
        <MonitoringArticle>
          <MonitoringSubTitle>Worker</MonitoringSubTitle>
          <ChartGridWrap>
            <ChartCardGridItem>
              <WorkloadMonitoringCard type="gpu-utilization" />
            </ChartCardGridItem>
            <ChartCardGridItem>
              <WorkloadMonitoringCard type="gpu-memory" />
            </ChartCardGridItem>
          </ChartGridWrap>
        </MonitoringArticle>
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

const MonitoringSubTitle = styled(DetailContentSubTitle)`
  margin-bottom: 10px;
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
