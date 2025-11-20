"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ResourceProgress } from "@/components/common/progress/resource-progress";
import type { CoreResourceType } from "@/types/common/core.interface";
import { getResourceInfo } from "@/utils/common/resource.util";

interface ResourceCardProps {
  resourceType: CoreResourceType;
  usage: number;
  request: number;
  limit: number;
}

export function ResourceCard({
  resourceType,
  usage,
  request,
  limit,
}: ResourceCardProps) {
  const { icon, unit } = getResourceInfo(resourceType);

  const usagePercent = (usage / limit) * 100;
  const requestPercent = (request / limit) * 100;

  return (
    <Container>
      <Header>
        <IconWrapper>
          <Icon name={icon} color="var(--icon-fill)" size={22} />
        </IconWrapper>
        <Title>
          <ResourceType>{resourceType}</ResourceType>
          <ResourceUnit>({unit})</ResourceUnit>
        </Title>
      </Header>
      <Body>
        <ResourceProgress
          resourceType={resourceType}
          usagePercent={usagePercent}
          requestPercent={requestPercent}
          height={6}
          borderRadius={4}
        />
        <ProgressAssist>
          <ProgressCount className="min" $percent={0}>
            0
          </ProgressCount>
          <ProgressCount className="request" $percent={requestPercent}>
            {request}
          </ProgressCount>
          <ProgressCount className="max" $percent={100}>
            {limit}
          </ProgressCount>
        </ProgressAssist>
      </Body>
      <Footer>
        <RowFooterItem>
          <Category className={`${resourceType} usage`}>사용</Category>
          <Count>{usage}</Count>
        </RowFooterItem>
        <RowFooterItem>
          <Category className={`${resourceType} remain`}>잔여</Category>
          <Count>{limit - usage}</Count>
        </RowFooterItem>
        <RowFooterItem>
          <Category className="total">전체</Category>
          <Count>{limit}</Count>
        </RowFooterItem>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  overflow: hidden;
  height: 130px;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 10px;
`;

const Body = styled.div`
  display: flex;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Footer = styled.div`
  padding: 10px 0;
  border-top: 1px solid #2a3041;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
`;

const Category = styled.div`
  position: relative;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  color: #cacaca;
  margin-left: 10px;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  &.total {
    margin-left: 0;
  }

  &.GPU.usage::before {
    background-color: var(--gpu-usage-color);
  }

  &.GPU.remain::before {
    background-color: var(--gpu-request-color);
  }

  &.CPU.usage::before {
    background-color: var(--cpu-usage-color);
  }

  &.CPU.remain::before {
    background-color: var(--cpu-request-color);
  }

  &.MEM.usage::before {
    background-color: var(--mem-usage-color);
  }

  &.MEM.remain::before {
    background-color: var(--mem-request-color);
  }
`;

const RowFooterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 100%;
  flex: 1;

  & + & {
    border-left: 1px solid #2a3041;
  }
`;

const ProgressAssist = styled.div`
  position: relative;
  padding: 4px 0;
  height: 20px;
`;

const ProgressCount = styled.span<{ $percent: number }>`
  position: absolute;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #bdbdbd;

  &.min {
    left: 0;
  }

  &.request {
    left: ${({ $percent }) => $percent - 2}%;
  }

  &.max {
    right: 0;
  }
`;

const Count = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #f5f5f5;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;

  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: Pretendard;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #f5f5f5;
`;

const ResourceType = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #f5f5f5;
`;

const ResourceUnit = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #c6c9d0;
`;

const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 24px;
  height: 24px;
  border-radius: 2px;

  --icon-fill: #e8eaed;
`;
