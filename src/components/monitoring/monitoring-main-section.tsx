import styled from "styled-components";
import { Tooltip } from "xiilab-ui";

import { MyIcon } from "@/components/common/icon";
import { ClusterResourceInfoTooltipTitle } from "@/components/common/tooltip-title/cluster-resource-info-tooltip-content";
import { DashboardQuickMenu } from "@/components/dashboard/dashboard-quick-menu";
import { MonitoringClusterResource } from "@/components/monitoring/monitoring-cluster-resource";
import { MonitoringIntroCard } from "@/components/monitoring/monitoring-intro-card";
import monitoringConstants from "@/constants/monitoring/monitoring.constant";
import { DashboardSectionTitle } from "@/styles/layers/dashboard-layers.styled";

export function MonitoringMainSection() {
  return (
    <Container>
      <Left>
        <MonitoringIntroCard />
        <QuickMenus>
          {monitoringConstants.quickMenus.map((menu) => (
            <DashboardQuickMenu key={menu.title} {...menu} />
          ))}
        </QuickMenus>
      </Left>
      <Right>
        <RightHeader>
          <DashboardSectionTitle>클러스터 자원 정보</DashboardSectionTitle>
          <Tooltip
            title={<ClusterResourceInfoTooltipTitle />}
            theme="light"
            placement="right"
          >
            <span className="tooltip-icon">
              <MyIcon name="Tooltip" size={20} />
            </span>
          </Tooltip>
        </RightHeader>
        <RightBody>
          <ResourceRow>
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#CCB7FF", "#8B59FF"]}
              resourceType="GPU"
            />
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#CCB7FF", "#8B59FF"]}
              resourceType="MIG"
            />
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#CCB7FF", "#8B59FF"]}
              resourceType="MPS"
            />
          </ResourceRow>
          <ResourceColumn>
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#B7CAFF", "#6459FF"]}
              resourceType="CPU"
            />
          </ResourceColumn>
          <ResourceColumn>
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#6ADFC7", "#007D43"]}
              resourceType="MEM"
            />
          </ResourceColumn>
          <ResourceColumn>
            <MonitoringClusterResource
              series={70}
              gradientToColors={["#C7EAFF", "#1FB2ED"]}
              resourceType="DISK"
            />
          </ResourceColumn>
        </RightBody>
      </Right>
    </Container>
  );
}

const Container = styled.section`
  border-radius: 10px;
  height: var(--dashboard-main-section-height);
  padding: 23px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  margin-bottom: var(--dashboard-main-section-margin-bottom);
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

const Right = styled.div`
  min-width: 892px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightHeader = styled.div`
  padding-left: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

const QuickMenus = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

const RightBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 8px;
`;

const ResourceRow = styled.div`
  grid-column: 1 / -1;
  border: 1px solid #292b32;
  border-radius: 4px;
  height: 178px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
`;

const ResourceColumn = styled(ResourceRow)`
  grid-column: span 1;
`;
