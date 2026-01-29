"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  useGetWorkloadStatusSummary,
  useGetWorkspaceResourceUsage,
} from "@/api/generated/workspace/workspace";
import { ResourceUsageCard } from "@/shared/components/card/resource-usage-card";
import { CountByWorkloadStatus } from "@/shared/components/layouts/count-by-workload-status";
import { USER_MONITORING_SELECTOR } from "@/shared/constants/selector.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { convertBytes } from "@/shared/utils/resource.util";
import {
  UserMonitoringCategoryTitle,
  UserMonitoringSectionDescription,
  UserMonitoringSectionHeader,
} from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringWorkloadArticle() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const { data: statusSummary } = useGetWorkloadStatusSummary(
    workspaceId ?? 0,
    {
      query: {
        enabled: Boolean(workspaceId),
      },
    },
  );
  const { data: resourceUsage } = useGetWorkspaceResourceUsage(
    workspaceId ?? 0,
    {
      query: {
        enabled: Boolean(workspaceId),
      },
    },
  );

  const totalCount = statusSummary?.total ?? 0;
  const runningCount = statusSummary?.running ?? 0;
  const terminatedCount = statusSummary?.terminated ?? 0;
  const pendingCount = statusSummary?.pending ?? 0;
  const errorCount = statusSummary?.error ?? 0;
  const statusItems: WorkloadStatusItem[] = [
    { status: "ALL", count: totalCount },
    { status: "RUNNING", count: runningCount },
    { status: "TERMINATED", count: terminatedCount },
    { status: "PENDING", count: pendingCount },
    { status: "ERROR", count: errorCount },
  ];
  const resourceTypes: CoreResourceType[] = ["GPU", "CPU", "MEM"];

  const renderStatusItem = ({ status, count }: WorkloadStatusItem) => (
    <CountByWorkloadStatus
      key={status}
      status={status}
      count={count}
      testId={USER_MONITORING_SELECTOR.status(status.toLowerCase())}
      countTestId={USER_MONITORING_SELECTOR.statusCount(status.toLowerCase())}
    />
  );
  const renderResourceUsageCard = (resourceType: CoreResourceType) => {
    if (!resourceUsage) {
      return (
        <ResourceUsageCard
          key={resourceType}
          resourceType={resourceType}
          total={0}
          count={0}
        />
      );
    }

    if (resourceType === "GPU") {
      return (
        <ResourceUsageCard
          key={resourceType}
          resourceType={resourceType}
          total={resourceUsage.gpuCount.total}
          count={resourceUsage.gpuCount.used}
        />
      );
    }

    if (resourceType === "CPU") {
      return (
        <ResourceUsageCard
          key={resourceType}
          resourceType={resourceType}
          total={resourceUsage.cpuCore.total}
          count={resourceUsage.cpuCore.used}
        />
      );
    }

    const totalMemoryGb = convertBytes(
      resourceUsage?.memoryBytes?.total ?? 0,
      "GB",
    ).value;
    const usedMemoryGb = convertBytes(
      resourceUsage?.memoryBytes?.used ?? 0,
      "GB",
    ).value;

    return (
      <ResourceUsageCard
        key={resourceType}
        resourceType={resourceType}
        total={totalMemoryGb}
        count={usedMemoryGb}
      />
    );
  };

  return (
    <Container>
      <Workload data-testid={USER_MONITORING_SELECTOR.WORKLOAD_STATUS}>
        <RightSectionHeader>
          <UserMonitoringCategoryTitle>
            워크로드 정보
          </UserMonitoringCategoryTitle>
          <UserMonitoringSectionDescription>
            생성한 워크로드 정보를 확인할 수 있습니다.
          </UserMonitoringSectionDescription>
        </RightSectionHeader>
        {/* 워크로드 정보 영역 */}
        <WorkloadStatusWrapper>
          {statusItems.map(renderStatusItem)}
        </WorkloadStatusWrapper>
      </Workload>
      <Resource data-testid={USER_MONITORING_SELECTOR.RESOURCE_USAGE}>
        <RightSectionHeader>
          <UserMonitoringCategoryTitle>
            사용 자원 정보
          </UserMonitoringCategoryTitle>
          <UserMonitoringSectionDescription>
            워크로드 생성시 사용중인 자원 정보를 확인할 수 있습니다.
          </UserMonitoringSectionDescription>
        </RightSectionHeader>
        <WorkloadResourceWrapper>
          {resourceTypes.map(renderResourceUsageCard)}
        </WorkloadResourceWrapper>
      </Resource>
    </Container>
  );
}

type WorkloadStatusItem = {
  status: Parameters<typeof CountByWorkloadStatus>[0]["status"];
  count: number;
};

const Container = styled.article`
  min-width: 596px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  background-color: #171b26;
  padding: 22px 20px;

  --primary-border-color: #3a4561;
  --secondary-border-color: #2a3041;
`;

const Workload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 20px;
`;

const Resource = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const WorkloadStatusWrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  height: 124px;
  border: 1px solid var(--primary-border-color);
  border-top-width: 0;
`;

const RightSectionHeader = styled(UserMonitoringSectionHeader)`
  margin-bottom: 12px;
`;

const WorkloadResourceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
  gap: 8px;
  height: 104px;
`;
