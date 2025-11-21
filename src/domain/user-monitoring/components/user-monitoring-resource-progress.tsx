import styled from "styled-components";

import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import type { CoreResourceType } from "@/shared/types/core.interface";

interface UserMonitoringResourceProgressProps {
  resourceType: CoreResourceType;
  usagePercent: number;
  requestPercent?: number;
  right?: React.ReactNode;
}

export function UserMonitoringResourceProgress({
  resourceType,
  usagePercent,
  requestPercent,
  right,
}: UserMonitoringResourceProgressProps) {
  return (
    <Container>
      <ProgressLabel>
        <Label className={resourceType}>{resourceType}</Label>
        <div>{right}</div>
      </ProgressLabel>
      <ResourceProgress
        resourceType={resourceType}
        usagePercent={usagePercent}
        requestPercent={requestPercent}
        height={4}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 12px;
`;

const Label = styled.div`
  color: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  position: relative;

  &::before {
    position: absolute;
    top: 50%;
    left: -12px;
    transform: translateY(-50%);
    border-radius: 50%;
    content: "";
    width: 6px;
    height: 6px;
  }

  &.GPU::before {
    background-color: var(--gpu-usage-color);
  }

  &.CPU::before {
    background-color: var(--cpu-usage-color);
  }

  &.MEM::before {
    background-color: var(--mem-usage-color);
  }

  &.DISK::before {
    background-color: var(--disk-usage-color);
  }
`;
