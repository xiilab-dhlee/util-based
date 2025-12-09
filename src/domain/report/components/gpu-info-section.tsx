"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface GpuInfoSectionProps {
  /** GPU 명 또는 노드 명 (예: "Worker-1") */
  nodeName?: string;
  /** GPU 모델 (예: "A100") */
  gpuModel?: string;
  /** 사용률 퍼센티지 */
  percentage: number;
  color?: string;
}

/**
 * GPU 정보 섹션 컴포넌트
 * 노드 정보 + 레이블 + 프로그레스 바를 표시하는 재사용 가능한 컴포넌트
 */
export function GpuInfoSection({
  nodeName,
  gpuModel,
  color,
  percentage,
}: GpuInfoSectionProps) {
  // color가 없으면 기본 GPU 색상 사용
  const dotColor = color || getResourceInfo("GPU").color;

  return (
    <InnerBox>
      <LeftSection>
        <MetricItem>
          <MetricLabel>GPU 명</MetricLabel>
          <MetricValue>{gpuModel}</MetricValue>
        </MetricItem>

        <HorizontalDivider />

        <MetricItem>
          <MetricLabel>노드명</MetricLabel>
          <MetricValue>{nodeName}</MetricValue>
        </MetricItem>
      </LeftSection>

      <VerticalDivider />

      <RightSection>
        <TopArea>
          <LabelWithDot>
            <BlueDot $color={dotColor} />
            <MetricLabel>{nodeName} GPU 평균 사용률</MetricLabel>
          </LabelWithDot>
          <UsageValue>
            <UsagePercentage>{percentage}%</UsagePercentage>
          </UsageValue>
        </TopArea>

        <ResourceProgress
          resourceType="GPU"
          usagePercent={percentage}
          height={6}
          borderRadius={3}
          backgroundColor="#e1e4e7"
          customColor={dotColor}
        />
      </RightSection>
    </InnerBox>
  );
}

const InnerBox = styled.div`
  display: flex;
  background-color: #ffffff;
  gap: 32px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 236px;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricLabel = styled(Typography.Text).attrs({
  variant: "subtitle-2-2",
})``;

const MetricValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})``;

const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e1e4e7;
  margin: 4px 0;
`;

const VerticalDivider = styled.div`
  width: 1px;
  background-color: #e5e5e5;
  align-self: stretch;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 12px
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelWithDot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BlueDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

const UsageValue = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const UsagePercentage = styled(Typography.Text).attrs({ variant: "title-2" })`
`;
