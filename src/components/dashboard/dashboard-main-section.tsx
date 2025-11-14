import styled from "styled-components";

import type { WorkloadStatusType } from "@/schemas/workload.schema";
import {
  DashboardCategoryTitle,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/styles/layers/dashboard-layers.styled";
import type { CoreResourceType } from "@/types/common/core.interface";
import { DashboardResourceArticle } from "./dashboard-resource-article";
import { DashboardResourceCard } from "./dashboard-resource-card";
import { DashboardResourceRecoveryArticle } from "./dashboard-resource-recovery-article";
import { DashboardWorkloadStatus } from "./dashboard-workload-status";

export function DashboardMainSection() {
  return (
    <Container>
      <Left>
        <LeftHeader>
          <DashboardSectionTitle>워크스페이스 자원 정보</DashboardSectionTitle>
          <DashboardSectionDescription>
            해당 워크스페이스 자원 정보와 자원회수 정보를 확인할 수 있습니다.
          </DashboardSectionDescription>
        </LeftHeader>
        <LeftBody>
          {/* 자원 정보 영역 */}
          <DashboardResourceArticle />
          {/* 자원 회수 정보 영역 */}
          <DashboardResourceRecoveryArticle />
        </LeftBody>
      </Left>
      <Right>
        <RightItem>
          <RightSectionHeader>
            <DashboardCategoryTitle>워크로드 정보</DashboardCategoryTitle>
            <DashboardSectionDescription>
              생성한 워크로드 정보를 확인할 수 있습니다.
            </DashboardSectionDescription>
          </RightSectionHeader>
          {/* 워크로드 정보 영역 */}
          <WorkloadStatusWrapper>
            {["ALL", "RUNNING", "COMPLETED", "PENDING", "FAILED"].map(
              (status) => (
                <DashboardWorkloadStatus
                  key={status}
                  status={status as WorkloadStatusType}
                />
              ),
            )}
          </WorkloadStatusWrapper>
        </RightItem>
        <RightItem>
          <RightSectionHeader>
            <DashboardCategoryTitle>사용 자원 정보</DashboardCategoryTitle>
            <DashboardSectionDescription>
              워크로드 생성시 사용중인 자원 정보를 확인할 수 있습니다.
            </DashboardSectionDescription>
          </RightSectionHeader>
          <WorkloadResourceWrapper>
            {["GPU", "CPU", "MEM"].map((v) => (
              <DashboardResourceCard
                key={v}
                resourceType={v as CoreResourceType}
                total={20}
                count={10}
              />
            ))}
          </WorkloadResourceWrapper>
          {/* 사용 자원 정보 영역 */}
          {/* <DashboardResourceUsingArticle /> */}
        </RightItem>
      </Right>
    </Container>
  );
}

const Container = styled.section`
  border-radius: 10px;
  height: var(--dashboard-main-section-height);
  padding: 23px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  margin-bottom: var(--dashboard-main-section-margin-bottom);
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
`;

const Right = styled.article`
  min-width: 596px;
  height: 400px;
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

const LeftHeader = styled(DashboardSectionHeader)`
  padding-left: 25px;
`;

const LeftBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const RightItem = styled.div`
  position: relative;
`;

const WorkloadStatusWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  height: 124px;
  border: 1px solid var(--primary-border-color);
  border-top-width: 0;
`;

const RightSectionHeader = styled(DashboardSectionHeader)`
  margin-bottom: 16px;
`;

const WorkloadResourceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
  gap: 8px;
  height: 104px;
`;
