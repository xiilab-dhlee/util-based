"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import {
  CardColorDot,
  CardHorizontalDivider,
  CardInnerBox,
  CardLabelWithDot,
  CardLeftSection,
  CardMetricItem,
  CardMetricLabel,
  CardMetricValue,
  CardRightSection,
  CardTopArea,
  CardUsagePercentage,
  CardUsageValue,
  CardVerticalDivider,
} from "@/domain/report/styles";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ResourceProgress } from "@/shared/components/progress/resource-progress";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface SystemGpuUsageCardProps {
  resourceUsage: ReportDetailResponse["resourceUsage"];
}

export function SystemGpuUsageCard({ resourceUsage }: SystemGpuUsageCardProps) {
  // Filter for GPU metric only
  const gpuMetric = resourceUsage.metrics.find((m) => m.type === "GPU");

  if (!gpuMetric) {
    return (
      <Card
        hoverable={false}
        contentVariant="compact"
        title="GPU 월 평균 개수 및 사용률"
      >
        <EmptyState
          title="GPU 데이터 없음"
          content="표시할 GPU 사용률 데이터가 없습니다."
        />
      </Card>
    );
  }

  const gpuColor = getResourceInfo("GPU").color;

  return (
    <Card
      hoverable={false}
      contentVariant="compact"
      title="GPU 월 평균 개수 및 사용률"
    >
      <CardContent>
        <CardInnerBox>
          <CardLeftSection>
            <CardMetricItem>
              <CardMetricLabel>전체 개수</CardMetricLabel>
              <CardMetricValue>{gpuMetric.total}개</CardMetricValue>
            </CardMetricItem>

            <CardHorizontalDivider />

            <CardMetricItem>
              <CardMetricLabel>월 평균 사용 개수</CardMetricLabel>
              <CardMetricValue>{gpuMetric.used}개</CardMetricValue>
            </CardMetricItem>
          </CardLeftSection>

          <CardVerticalDivider />

          <CardRightSection>
            <CardTopArea>
              <CardLabelWithDot>
                <CardColorDot $color={gpuColor} />
                <CardMetricLabel>GPU 평균 사용률</CardMetricLabel>
              </CardLabelWithDot>
              <CardUsageValue>
                <CardUsagePercentage>
                  {gpuMetric.percentage}%
                </CardUsagePercentage>
              </CardUsageValue>
            </CardTopArea>

            <ResourceProgress
              resourceType="GPU"
              usagePercent={gpuMetric.percentage}
              height={6}
              borderRadius={3}
              backgroundColor="#e1e4e7"
            />
          </CardRightSection>
        </CardInnerBox>
      </CardContent>
    </Card>
  );
}

const CardContent = styled.div`
  width: 100%;
`;
