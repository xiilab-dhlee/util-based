"use client";

import styled from "styled-components";
import { Card, Typography } from "xiilab-ui";

import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface SystemGpuUsageCardProps {
  resourceUsage: ReportDetailResponse["resourceUsage"];
}

export function SystemGpuUsageCard({ resourceUsage }: SystemGpuUsageCardProps) {
  // Filter for GPU metric only
  const gpuMetric = resourceUsage.metrics.find((m) => m.type === "GPU");

  if (!gpuMetric) return null;

  return (
    <Card
      hoverable={false}
      contentVariant="compact"
      title="GPU 월 평균 개수 및 사용률"
    >
      <CardContent>
        <InnerBox>
          <LeftSection>
            <MetricItem>
              <MetricLabel>전체 개수</MetricLabel>
              <MetricValue>{gpuMetric.total}개</MetricValue>
            </MetricItem>

            <HorizontalDivider />

            <MetricItem>
              <MetricLabel>월 평균 사용 개수</MetricLabel>
              <MetricValue>{gpuMetric.used}개</MetricValue>
            </MetricItem>
          </LeftSection>

          <VerticalDivider />

          <RightSection>
            <TopArea>
              <LabelWithDot>
                <BlueDot />
                <MetricLabel>GPU 평균 사용률</MetricLabel>
              </LabelWithDot>
              <UsageValue>
                <UsagePercentage>{gpuMetric.percentage}%</UsagePercentage>
              </UsageValue>
            </TopArea>

            <ResourceProgress
              resourceType="GPU"
              usagePercent={gpuMetric.percentage}
              height={6}
              borderRadius={3}
              backgroundColor="#e1e4e7"
            />
          </RightSection>
        </InnerBox>
      </CardContent>
    </Card>
  );
}

const CardContent = styled.div`
  width: 100%;
`;

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
  gap: 12px;
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

const BlueDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${getResourceInfo("GPU").color};
`;

const UsageValue = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const UsagePercentage = styled(Typography.Text).attrs({ variant: "title-2" })`
`;
