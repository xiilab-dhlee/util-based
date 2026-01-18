import styled from "styled-components";

import { MonitoringClusterResourceSection } from "@/domain/monitoring/components/monitoring-cluster-resource-section";
import { MonitoringIntroCard } from "@/domain/monitoring/components/monitoring-intro-card";
import { MONITORING_QUICK_MENUS } from "@/domain/monitoring/constants/monitoring.constant";
import { UserMonitoringQuickMenu } from "@/domain/user-monitoring/components/user-monitoring-quick-menu";

export function MonitoringMainSection() {
  return (
    <Container>
      <Left>
        <MonitoringIntroCard />
        <QuickMenus>
          {MONITORING_QUICK_MENUS.map((menu) => (
            <UserMonitoringQuickMenu key={menu.title} {...menu} />
          ))}
        </QuickMenus>
      </Left>
      <MonitoringClusterResourceSection />
    </Container>
  );
}

const Container = styled.section`
  border-radius: 10px;
  height: var(--user-monitoring-main-section-height);
  padding: 23px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  margin-bottom: var(--user-monitoring-main-section-margin-bottom);
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);

  --primary-border-color: #3a4561;
  --secondary-border-color: #2a3041;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const QuickMenus = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;
