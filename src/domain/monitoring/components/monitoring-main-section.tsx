import styled from "styled-components";

import { MonitoringClusterResource } from "@/domain/monitoring/components/monitoring-cluster-resource";
import { MonitoringIntroCard } from "@/domain/monitoring/components/monitoring-intro-card";
import {
  CLUSTER_RESOURCE_DUMMY_DATA,
  MONITORING_QUICK_MENUS,
} from "@/domain/monitoring/constants/monitoring.constant";
import { UserMonitoringQuickMenu } from "@/domain/user-monitoring/components/user-monitoring-quick-menu";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { ClusterResourceInfoTooltipTitle } from "@/shared/components/tooltip-title/cluster-resource-info-tooltip-content";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

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
      <Right>
        <RightHeader>
          <UserMonitoringSectionTitle>
            클러스터 리소스 정보
          </UserMonitoringSectionTitle>
          <GuideTooltip
            title={<ClusterResourceInfoTooltipTitle />}
            iconSize={12}
            placement="right"
          />
        </RightHeader>
        <RightBody>
          <ResourceRow>
            <MonitoringClusterResource
              gradientToColors={[
                "var(--gpu-usage-color)",
                "var(--gpu-request-color)",
              ]}
              resourceType="GPU"
              data={CLUSTER_RESOURCE_DUMMY_DATA.GPU}
            />
            <MonitoringClusterResource
              gradientToColors={[
                "var(--gpu-usage-color)",
                "var(--gpu-request-color)",
              ]}
              resourceType="MIG"
              data={CLUSTER_RESOURCE_DUMMY_DATA.MIG}
            />
            <MonitoringClusterResource
              gradientToColors={[
                "var(--gpu-usage-color)",
                "var(--gpu-request-color)",
              ]}
              resourceType="MPS"
              data={CLUSTER_RESOURCE_DUMMY_DATA.MPS}
            />
          </ResourceRow>
          <ResourceColumn>
            <MonitoringClusterResource
              gradientToColors={[
                "var(--cpu-usage-color)",
                "var(--cpu-request-color)",
              ]}
              resourceType="CPU"
              data={CLUSTER_RESOURCE_DUMMY_DATA.CPU}
            />
          </ResourceColumn>
          <ResourceColumn>
            <MonitoringClusterResource
              gradientToColors={[
                "var(--mem-usage-color)",
                "var(--mem-request-color)",
              ]}
              resourceType="MEM"
              data={CLUSTER_RESOURCE_DUMMY_DATA.MEM}
            />
          </ResourceColumn>
          <ResourceColumn>
            <MonitoringClusterResource
              gradientToColors={[
                "var(--disk-usage-color)",
                "var(--disk-request-color)",
              ]}
              resourceType="DISK"
              data={CLUSTER_RESOURCE_DUMMY_DATA.DISK}
            />
          </ResourceColumn>
        </RightBody>
      </Right>
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
