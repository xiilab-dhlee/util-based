import styled from "styled-components";

import {
  UserMonitoringSectionDescription,
  UserMonitoringSectionHeader,
  UserMonitoringSectionTitle,
} from "@/styles/layers/user-monitoring-layers.styled";
import { UserMonitoringResourceArticle } from "./user-monitoring-resource-article";
import { UserMonitoringResourceRecoveryArticle } from "./user-monitoring-resource-recovery-article";
import { UserMonitoringWorkloadArticle } from "./user-monitoring-workload-article";

export function UserMonitoringMainSection() {
  return (
    <Container>
      <Left>
        <LeftHeader>
          <UserMonitoringSectionTitle>
            워크스페이스 자원 정보
          </UserMonitoringSectionTitle>
          <UserMonitoringSectionDescription>
            해당 워크스페이스 자원 정보와 자원회수 정보를 확인할 수 있습니다.
          </UserMonitoringSectionDescription>
        </LeftHeader>
        <LeftBody>
          {/* 자원 정보 영역 */}
          <UserMonitoringResourceArticle />
          {/* 자원 회수 정보 영역 */}
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
  min-width: 596px;
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
