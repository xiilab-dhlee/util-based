"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getPercent } from "@/shared/utils/calc.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

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
  const { text, unit, icon } = getResourceInfo(resourceType);

  const usagePercent = getPercent(usage, limit, 0);
  const totalPercent = getPercent(usage + request, limit, 0);

  return (
    <Container>
      <Header>
        <IconWrapper className={resourceType}>
          {icon ? (
            <Icon name={icon} color="var(--icon-fill)" size={22} />
          ) : null}
        </IconWrapper>
        <Title>
          <ResourceType>{text}</ResourceType>
          <ResourceUnit>({unit})</ResourceUnit>
        </Title>
      </Header>
      <Body>
        <ResourceProgress
          resourceType={resourceType}
          usagePercent={usagePercent}
          requestPercent={totalPercent}
          height={6}
          borderRadius={4}
          backgroundColor="#CED2D6"
        />
        {/* <ProgressAssist>
          <ProgressCount className="min" $percent={0}>
            0
          </ProgressCount>
          <ProgressCount className="request" $percent={requestPercent}>
            {request}
          </ProgressCount>
          <ProgressCount className="max" $percent={100}>
            {limit}
          </ProgressCount>
        </ProgressAssist> */}
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
  background: #F7F9FB;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  overflow: hidden;
  height: 106px;
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
  border-top: 1px solid rgba(150, 150, 150, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
`;

const Category = styled.div`
  position: relative;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  color: #5F6368;
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

  &.total::before {
    background-color: #5F6368;
  }

  &.GPU.usage::before, &.MIG.usage::before {
    background-color: var(--gpu-usage-color);
  }

  &.GPU.remain::before, &.MIG.remain::before {
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
  align-items: center;
  justify-content: center;
  flex-direction: row;
  height: 100%;
  gap: 6px;
  flex: 1;

  & + & {
    border-left: 1px solid rgba(150, 150, 150, 0.25);
  }
`;

// const ProgressAssist = styled.div`
//   position: relative;
//   padding: 4px 0;
//   height: 20px;
// `;

// const ProgressCount = styled.span<{ $percent: number }>`
//   position: absolute;
//   font-weight: 400;
//   font-size: 10px;
//   line-height: 12px;
//   color: var(--color-gray-03);

//   &.min {
//     left: 0px;
//   }

//   &.request {
//     left: ${({ $percent }) => $percent - 2}%;
//   }

//   &.max {
//     right: 0px;
//   }
// `;

const Count = styled.span`
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  color: var(--color-gray-02);
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

`;

const ResourceType = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const ResourceUnit = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 24px;
  width: 24px;
  border-radius: 2px;
  background-color: #f7f9fb;
border: 1px solid #D9D9D9;
  --icon-fill: #e8eaed;

  &.GPU,
  &.MIG,
  &.MPS {
    --icon-fill: var(--gpu-usage-color);
  }

  &.CPU {
    --icon-fill: var(--cpu-usage-color);
  }

  &.MEM {
    --icon-fill: var(--mem-usage-color);
  }
`;
