import styled from "styled-components";

import { UserMonitoringResourceArticle } from "@/domain/user-monitoring/components/user-monitoring-resource-article";
import { UserMonitoringResourceRecoveryArticle } from "@/domain/user-monitoring/components/user-monitoring-resource-recovery-article";
import { UserMonitoringWorkloadArticle } from "@/domain/user-monitoring/components/user-monitoring-workload-article";
import {
  UserMonitoringSectionDescription,
  UserMonitoringSectionHeader,
  UserMonitoringSectionTitle,
} from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringMainSection() {
  return (
    <Container>
      <Left>
        <LeftHeader>
          <UserMonitoringSectionTitle>
            워크스페이스 리소스 정보
          </UserMonitoringSectionTitle>
          <UserMonitoringSectionDescription>
            해당 워크스페이스 리소스 정보와 리소스회수 정보를 확인할 수
            있습니다.
          </UserMonitoringSectionDescription>
        </LeftHeader>
        <LeftBody>
          <UserMonitoringResourceArticle />
          <UserMonitoringResourceRecoveryArticle />
        </LeftBody>
      </Left>
      <Right>
        <UserMonitoringWorkloadArticle />
      </Right>
    </Container>
  );
}

const Container = styled.section`
  border-radius: 10px;
  height: var(--user-monitoring-main-section-height);
  padding: 23px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  margin-bottom: var(--user-monitoring-main-section-margin-bottom);
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
  width: 596px;
  height: 400px;
  overflow: hidden;
  position: relative;
`;

const LeftHeader = styled(UserMonitoringSectionHeader)`
  padding-left: 25px;
`;

const LeftBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;
