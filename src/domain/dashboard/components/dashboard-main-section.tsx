import styled from "styled-components";

import {
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/styles/layers/dashboard-layers.styled";
import { DashboardResourceArticle } from "./dashboard-resource-article";
import { DashboardResourceRecoveryArticle } from "./dashboard-resource-recovery-article";
import { DashboardWorkloadArticle } from "./dashboard-workload-article";

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
        <DashboardWorkloadArticle />
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
  overflow: hidden;
  position: relative;
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
