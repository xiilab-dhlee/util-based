"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { WorkloadMonitoringCard } from "@/domain/workload/components/detail/workload-monitoring-card";
import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function AsideWorkloadMonitoring() {
  const { onToggle } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  const handleCloseMonitoring = () => {
    onToggle();
  };

  return (
    <Container data-testid={WORKLOAD_SELECTOR.ASIDE_MONITORING}>
      <Header>
        <Title>모니터링</Title>
        <IconWrapper type="button" onClick={handleCloseMonitoring}>
          <Icon name="Close" color="var(--icon-fill)" size={18} />
        </IconWrapper>
      </Header>
      <Body>
        <CardWrapper>
          <WorkloadMonitoringCard type="cpu-usage" />
        </CardWrapper>
        <CardWrapper>
          <WorkloadMonitoringCard type="memory-usage" />
        </CardWrapper>
        <CardWrapper>
          <WorkloadMonitoringCard type="gpu-utilization" />
        </CardWrapper>
        <CardWrapper>
          <WorkloadMonitoringCard type="gpu-memory" />
        </CardWrapper>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #544AD8;
  border-radius: 4px;
  width: 480px;
  height: 100%;
  padding: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #E9EBEE;
  padding-bottom: 8px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #000;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  gap: 14px;
  display: flex;
  flex-direction: column;
`;

const CardWrapper = styled.div`
  flex-shrink: 0;
`;
