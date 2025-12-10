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
  data: JobTypeData[];
}

/**
 * Job Type별 개수 분포 컴포넌트
 * 세그먼트 프로그레스 바로 각 Job Type 비율을 시각화
 */
export function JobTypeDistribution({ data }: JobTypeDistributionProps) {
  // 데이터가 없을 때 빈 상태 표시
  if (!data || data.length === 0) {
    return (
      <Card hoverable={false} contentVariant="compact" title="Job Type별 개수">
        <EmptyState
          title="데이터 없음"
          content="표시할 Job Type 데이터가 없습니다."
        />
      </Card>
    );
  }

  // 각 세그먼트의 라벨과 색상을 미리 계산
  const segments = data.map((item) => ({
    ...item,
    label: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
    color: WORKLOAD_JOB_TYPE_COLOR_MAP[item.type],
  }));

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
            <SegmentInfo key={segment.type} $width={segment.percentage}>
              <SegmentPrimaryText>{segment.count}개</SegmentPrimaryText>
              <SegmentSecondaryText>
                ({segment.percentage}%)
              </SegmentSecondaryText>
            </SegmentInfo>
          ))}
        </SegmentRow>

        <SegmentProgressBarContainer>
          {segments.map((segment, index) => (
            <SegmentProgressBar
              key={segment.type}
              $color={segment.color}
              $width={segment.percentage}
              $isFirst={index === 0}
              $isLast={index === segments.length - 1}
            />
          ))}
        </SegmentProgressBarContainer>
      </SegmentContentBox>
    </Card>
  );
}
