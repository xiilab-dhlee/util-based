"use client";

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
    <CardInnerBox>
      <CardLeftSection>
        <CardMetricItem>
          <CardMetricLabel>GPU 명</CardMetricLabel>
          <CardMetricValue>{gpuModel}</CardMetricValue>
        </CardMetricItem>

        <CardHorizontalDivider />

        <CardMetricItem>
          <CardMetricLabel>노드명</CardMetricLabel>
          <CardMetricValue>{nodeName}</CardMetricValue>
        </CardMetricItem>
      </CardLeftSection>

      <CardVerticalDivider />

      <CardRightSection>
        <CardTopArea>
          <CardLabelWithDot>
            <CardColorDot $color={dotColor} />
            <CardMetricLabel>{nodeName} GPU 평균 사용률</CardMetricLabel>
          </CardLabelWithDot>
          <CardUsageValue>
            <CardUsagePercentage>{percentage}%</CardUsagePercentage>
          </CardUsageValue>
        </CardTopArea>

        <ResourceProgress
          resourceType="GPU"
          usagePercent={percentage}
          height={6}
          borderRadius={3}
          backgroundColor="#e1e4e7"
          customColor={dotColor}
        />
      </CardRightSection>
    </CardInnerBox>
  );
}
