import Image from "next/image";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface DashboardResourceCardProps {
  resourceType: CoreResourceType;
  total: number;
  count: number;
}

export function DashboardResourceCard({
  resourceType,
  total,
  count,
}: DashboardResourceCardProps) {
  const { text, unit, icon } = getResourceInfo(resourceType);
  return (
    <Container>
      <Body>
        <Left>
          <Image
            src="/images/device-bg2.png"
            width="72"
            height="72"
            alt="Device Bg"
            draggable={false}
          />
          <IconWrapper className={resourceType}>
            <Icon name={icon} color="var(--icon-fill)" size={32} />
          </IconWrapper>
        </Left>
        <Right>
          <RightHeader>
            <Typography.Text variant="subtitle-2" color="#C5C6C8">
              {text} in use
            </Typography.Text>
          </RightHeader>
        </Right>
      </Body>
      <Footer>
        <ResourceProgress
          resourceType={resourceType}
          usagePercent={(count / total) * 100}
          height={4}
          borderRadius={1}
          backgroundColor="#292B32"
        />
        <Count>
          <Typography.Text variant="body-1-3" color="#AEAEAE">
            {count}
            &nbsp;/
          </Typography.Text>
          <Typography.Text variant="subtitle-2-2" color="#F5F5F5">
            {total}
            {unit}
          </Typography.Text>
        </Count>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 104px;
  border-radius: 4px;
  border: 1px solid var(--primary-border-color);
  background-color: #070913;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 18px;
  padding: 0 10px;
  position: relative;
`;

const Left = styled.div`
  width: 76px;
  height: 100%;
  position: relative;
  user-select: none;
  padding-right: 3px;
  padding-bottom: 5px;

  & img {
    width: 100%;
    height: 100%;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  background-color: #070913;

  &.GPU {
    border-color: var(--gpu-usage-color);
    --icon-fill: var(--gpu-icon-color);
  }

  &.CPU {
    border-color: var(--cpu-usage-color);
    --icon-fill: var(--cpu-icon-color);
  }

  &.MEM {
    border-color: var(--mem-usage-color);
    --icon-fill: var(--mem-icon-color);
  }
`;

const Right = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 10px 0 8px;
`;

const RightHeader = styled.div`
  text-align: right;
  width: 100%;

  padding-right: 4px;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--secondary-border-color);
`;

const Count = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  right: 14px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  color: #aeaeae;
`;
