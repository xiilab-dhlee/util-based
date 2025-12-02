import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type { CoreResourceType } from "@/shared/types/core.interface";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface ResourceUsageBarProps {
  type: CoreResourceType;
  currentValue: number;
  maxValue: number;
  usedPercentage: number;
  isOverLimit?: boolean;
}

/**
 * Clamps a percentage value to the [0, 100] range
 */
const clampPercentage = (value: number): number => {
  return Math.max(0, Math.min(value, 100));
};

export function ResourceUsageBar({
  type,
  currentValue,
  maxValue,
  usedPercentage,
  isOverLimit = false,
}: ResourceUsageBarProps) {
  const requestPercentage = clampPercentage(
    maxValue <= 0 ? 0 : (currentValue / maxValue) * 100,
  );
  const clampedUsedPercentage = clampPercentage(usedPercentage);
  const { text, color } = getResourceInfo(type);

  return (
    <Container>
      <LabelRow>
        <LabelGroup>
          <Typography.Text variant="body-2-3" color="#484848">
            {text}
          </Typography.Text>
          <StatusText $isOverLimit={isOverLimit}>
            <Typography.Text variant="body-4-1" color="#FF3B30">
              요청량 초과
            </Typography.Text>
          </StatusText>
        </LabelGroup>
      </LabelRow>
      <BarContainer>
        <BarBackground>
          <RequestBar
            $percentage={requestPercentage}
            $color={isOverLimit ? "#FF3B30" : color}
          >
            <UsedBar $percentage={clampedUsedPercentage}>
              <Divider />
            </UsedBar>
          </RequestBar>
        </BarBackground>
        <ValueText>
          <Typography.Text variant="body-4-2" color="#555555">
            {currentValue}
          </Typography.Text>
        </ValueText>
      </BarContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusText = styled.div<{ $isOverLimit: boolean }>`
  opacity: ${(props) => (props.$isOverLimit ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 26px;
  background-color: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const BarBackground = styled.div`
  position: absolute;
  left: 10px;
  right: 40px;
  height: 6px;
  background-color: #eaeaea;
  border-radius: 4px;
  box-shadow:
    0px 0px 4px 0px rgba(255, 255, 255, 0.25),
    inset 0px 1px 1px 0px rgba(128, 142, 151, 0.14);
`;

const RequestBar = styled.div<{ $percentage: number; $color: string }>`
  position: relative;
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.$color};
  border-radius: 4px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
`;

const UsedBar = styled.div<{ $percentage: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: #757380;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Divider = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #ffffff;
  z-index: 2;
`;

const ValueText = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 3;
`;
