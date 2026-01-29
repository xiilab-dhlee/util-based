import Image from "next/image";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getPercent } from "@/shared/utils/calc.util";
import { formatNumber, formatNumberWithUnit } from "@/shared/utils/format.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface ResourceUsageCardProps {
  resourceType: CoreResourceType;
  total: number;
  count: number;
}

/**
 * 리소스(GPU, CPU, MEM) 사용량을 표시하는 범용 카드 컴포넌트
 * 여러 도메인(user-monitoring, setting 등)에서 재사용됩니다.
 */
export function ResourceUsageCard({
  resourceType,
  total,
  count,
}: ResourceUsageCardProps) {
  const { text, unit, icon } = getResourceInfo(resourceType);
  const safeTotal = Number.isFinite(total) ? total : 0;
  const safeCount = Number.isFinite(count) ? count : 0;
  const usagePercent = Math.min(100, getPercent(safeCount, safeTotal));
  const formattedCount = formatNumber(safeCount, "0");
  const formattedTotalWithUnit = formatNumberWithUnit(safeTotal, unit, "0");
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
              {text}
            </Typography.Text>
          </RightHeader>
        </Right>
      </Body>
      <Footer>
        <ResourceProgress
          resourceType={resourceType}
          usagePercent={usagePercent}
          height={4}
          borderRadius={1}
          backgroundColor="#292B32"
        />
        <Count>
          <Typography.Text variant="title-2" color="#F5F5F5">
            {formattedCount}
          </Typography.Text>
          <Typography.Text variant="body-1-3" color="#AEAEAE">
            /&nbsp;{formattedTotalWithUnit}
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
  width: 100%;

  padding: 0 4px 12px 10px;
  border-bottom: 1px solid var(--secondary-border-color);
  margin-bottom: 13px;
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
