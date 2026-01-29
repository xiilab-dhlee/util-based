"use client";

import styled from "styled-components";

import type { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MonitoringActiveWorkloadArticle } from "@/domain/monitoring/components/monitoring-active-workload-article";
import { MonitoringUserResourceArticle } from "@/domain/monitoring/components/monitoring-user-resource-article";
import { MonitoringWorkloadStatus } from "@/domain/monitoring/components/monitoring-workload-status";
import { MonitoringWorkspaceArticle } from "@/domain/monitoring/components/monitoring-workspace-article";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function MonitoringSubSection() {
  return (
    <Container>
      <Left>
        <MonitoringWorkspaceArticle />
        <MonitoringUserResourceArticle />
      </Left>
      <Right>
        <ArticleTitle style={{ marginBottom: "0" }}>
          <SectionTitle>워크로드 정보</SectionTitle>
        </ArticleTitle>
        <WorkloadStatuses>
          {["ALL", "RUNNING", "PENDING", "ERROR"].map((status) => (
            <MonitoringWorkloadStatus
              key={status}
              status={status as WorkloadStatusResponseWorkloadStatus}
              total={9999}
            />
          ))}
        </WorkloadStatuses>
        <MonitoringActiveWorkloadArticle />
      </Right>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 980px;

  --right-width: 620px;
`;

const Left = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc(100% - var(--right-width) - 16px);
`;

const Right = styled.article`
  width: var(--right-width);
  flex-shrink: 0;
  height: 100%;
  padding: 23px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const ArticleTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  position: relative;
  padding-left: 5px;
  margin-bottom: 20px;
`;

const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #070913;
`;

const WorkloadStatuses = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  height: 86px;

  --border-color: #ced2d6;
`;
