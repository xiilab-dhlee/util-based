"use client";

import { Card } from "xiilab-ui";

import {
  LegendDot,
  LegendGroup,
  LegendItem,
  LegendText,
  SegmentContentBox,
  SegmentInfo,
  SegmentPrimaryText,
  SegmentProgressBar,
  SegmentProgressBarContainer,
  SegmentRow,
  SegmentSecondaryText,
} from "@/domain/report/styles";
import {
  WORKLOAD_JOB_TYPE_COLOR_MAP,
  WORKLOAD_JOB_TYPE_LABEL_MAP,
} from "@/domain/workload/constants/workload.constant";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import { EmptyState } from "@/shared/components/empty-state/empty-state";

interface JobTypeData {
  type: WorkloadJobType;
  count: number;
  percentage: number;
}

interface JobTypeDistributionProps {
  data?: JobTypeData[];
}

/**
 * Job Type별 개수 분포 컴포넌트
 * 세그먼트 프로그레스 바로 각 Job Type 비율을 시각화
 */
export function JobTypeDistribution({ data = [] }: JobTypeDistributionProps) {
  // 데이터가 없을 때 빈 상태 표시
  if (data.length === 0) {
    return (
      <Card hoverable={false} contentVariant="compact" title="Job Type별 개수">
        <EmptyState
          title="데이터 없음"
          content="표시할 Job Type 데이터가 없습니다."
        />
      </Card>
    );
  }

  // 최소 너비 보장 (백분율) - 개수와 퍼센트를 표시하기 위한 최소 공간
  const MIN_WIDTH_PERCENT = 5;

  // 각 세그먼트의 최소 너비를 보장한 후 정규화하여 합이 100%를 넘지 않도록 함
  const segmentsWithMinWidth = data.map((item) => ({
    ...item,
    naturalWidth: Math.max(item.percentage, MIN_WIDTH_PERCENT),
  }));

  const totalWidth = segmentsWithMinWidth.reduce(
    (sum, segment) => sum + segment.naturalWidth,
    0,
  );

  const segments = segmentsWithMinWidth.map((item) => {
    // 너비 합이 100%를 초과하는 경우 정규화
    const normalizedWidth =
      totalWidth > 100
        ? (item.naturalWidth / totalWidth) * 100
        : item.naturalWidth;

    return {
      ...item,
      originalPercentage: item.percentage,
      displayWidth: normalizedWidth,
      label: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
      color: WORKLOAD_JOB_TYPE_COLOR_MAP[item.type],
    };
  });

  return (
    <Card
      hoverable={false}
      contentVariant="compact"
      title="Job Type별 개수"
      actionElement={
        <LegendGroup>
          {segments.map((segment) => (
            <LegendItem key={segment.type}>
              <LegendDot $color={segment.color} />
              <LegendText>{segment.label}</LegendText>
            </LegendItem>
          ))}
        </LegendGroup>
      }
    >
      <SegmentContentBox>
        <SegmentRow>
          {segments.map((segment) => (
            <SegmentInfo key={segment.type} $width={segment.displayWidth}>
              <SegmentPrimaryText>{segment.count}개</SegmentPrimaryText>
              <SegmentSecondaryText>
                ({segment.originalPercentage}%)
              </SegmentSecondaryText>
            </SegmentInfo>
          ))}
        </SegmentRow>

        <SegmentProgressBarContainer>
          {segments.map((segment, index) => (
            <SegmentProgressBar
              key={segment.type}
              $color={segment.color}
              $width={segment.displayWidth}
              $isFirst={index === 0}
              $isLast={index === segments.length - 1}
            />
          ))}
        </SegmentProgressBarContainer>
      </SegmentContentBox>
    </Card>
  );
}
