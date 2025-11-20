import styled from "styled-components";

import type { CoreResourceType } from "@/shared/types/core.interface";
import { DashboardResourceProgress } from "./dashboard-resource-progress";

interface DashboardResourceNodeProps {
  resourceType: CoreResourceType;
  unit: string;
  total: number;
  usage: number;
  request: number;
}

export function DashboardResourceNode({
  resourceType,
  unit,
  total,
  usage,
  request,
}: DashboardResourceNodeProps) {
  const usagePercent = (usage / total) * 100;
  const requestPercent = (request / total) * 100;
  return (
    <Container>
      <Body>
        <DashboardResourceProgress
          resourceType={resourceType}
          usagePercent={usagePercent}
          requestPercent={usagePercent + requestPercent}
          right={<Total>총 {`${total}${unit}`}</Total>}
        />
      </Body>
      <Footer>
        <ResourceQuota>
          <ResourceQuotaKey>사용량 :</ResourceQuotaKey>
          <ResourceQuotaValue>{`${usage}${unit}`}</ResourceQuotaValue>
        </ResourceQuota>
        <ResourceQuota>
          <ResourceQuotaKey>요청량 :</ResourceQuotaKey>
          <ResourceQuotaValue>{`${request}${unit}`}</ResourceQuotaValue>
        </ResourceQuota>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  overflow: hidden;

  --border-color: #2e354a;
`;

const Body = styled.div`
  flex: 1;
  background-color: #171b26;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const Footer = styled.div`
  padding: 6px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
`;

const ResourceQuota = styled.div`
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: #f5f5f5;
  font-size: 12px;
  line-height: 14px;

  & + & {
    border-left: 1px solid #3a4561;
  }
`;

const ResourceQuotaKey = styled.div`
  font-weight: 400;
`;

const ResourceQuotaValue = styled.div`
  font-weight: 600;
`;

const Total = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #aeaeae;
`;
