import styled from "styled-components";

import type { WorkloadStatusType } from "@/domain/workload/schemas/workload.schema";
import { ResourceProgressCard } from "@/shared/components/card/resource-progress-card";
import { CountByWorkloadStatus } from "@/shared/components/layouts/count-by-workload-status";
import type { CoreResourceType } from "@/shared/types/core.interface";
import {
  UserMonitoringCategoryTitle,
  UserMonitoringSectionDescription,
  UserMonitoringSectionHeader,
} from "@/styles/layers/user-monitoring-layers.styled";

export function SettingWorkloadArticle() {
  return (
    <Container>
      <Workload>
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
          {["ALL", "RUNNING", "COMPLETED", "PENDING", "FAILED"].map(
            (status) => (
              <CountByWorkloadStatus
                key={status}
                status={status as WorkloadStatusType}
              />
            ),
          )}
        </WorkloadStatusWrapper>
      </Workload>
      <Resource>
        <RightSectionHeader>
          <UserMonitoringCategoryTitle>
            사용 자원 정보
          </UserMonitoringCategoryTitle>
          <UserMonitoringSectionDescription>
            워크로드 생성시 사용중인 자원 정보를 확인할 수 있습니다.
          </UserMonitoringSectionDescription>
        </RightSectionHeader>
        <WorkloadResourceWrapper>
          {["GPU", "CPU", "MEM"].map((v) => (
            <ResourceProgressCard
              key={v}
              resourceType={v as CoreResourceType}
              total={20}
              count={10}
            />
          ))}
        </WorkloadResourceWrapper>
      </Resource>
    </Container>
  );
}

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
