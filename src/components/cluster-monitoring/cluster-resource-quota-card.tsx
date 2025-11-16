"use client";

import classNames from "classnames";
import styled from "styled-components";

import type { CoreResourceType } from "@/types/common/core.interface";
import { getResourceInfo } from "@/utils/common/resource.util";
import { MyIcon } from "../common/icon";
import { ResourceProgress } from "../common/progress/resource-progress";

interface ClusterResourceQuotaCardProps {
  resourceName: CoreResourceType;
  total: number;
  quota: number;
  showDivider?: boolean;
}

export function ClusterResourceQuotaCard({
  resourceName,
  total,
  quota,
  showDivider = false,
}: ClusterResourceQuotaCardProps) {
  const { icon, color } = getResourceInfo(resourceName);

  return (
    <Containter className={classNames({ divider: showDivider })}>
      <Header>
        <HeaderLeft>
          <IconWrapper $color={color}>
            <MyIcon name={icon} size={24} color={color} />
          </IconWrapper>
          <Title>{resourceName}</Title>
        </HeaderLeft>
        <HeaderRight>{(quota / total) * 100}%</HeaderRight>
      </Header>
      <Body>
        <ResourceProgress
          resourceType={resourceName}
          usagePercent={(quota / total) * 100}
          height={4}
          borderRadius={1}
          backgroundColor="#D1D5DC"
        />
        <Records>
          <Record>
            <RecordKey>총량</RecordKey>
            <RecordValue>{total}</RecordValue>
          </Record>
          <Record>
            <RecordKey>할당량</RecordKey>
            <RecordValue>{quota}</RecordValue>
          </Record>
        </Records>
      </Body>
    </Containter>
  );
}

const Containter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 10px;

  &.divider {
    border-right: 1px solid #e0e0e0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #000000;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #292b32;
`;

const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #f7f9fb;
  border: 1px solid #d1d5dc;
  border-radius: 2px;

  --icon-fill: ${({ $color }) => $color};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Records = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  height: 44px;
  border: 1px solid #f5f5f5;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 4px;
`;

const Record = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecordKey = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  color: #5e676f;
`;

const RecordValue = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #2c3136;
`;
