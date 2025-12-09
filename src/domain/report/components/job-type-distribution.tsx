"use client";

import styled from "styled-components";
import { Card, Typography } from "xiilab-ui";

import type { WorkloadJobType } from "@/shared/constants/workload.constant";
import {
  WORKLOAD_JOB_TYPE_COLOR_MAP,
  WORKLOAD_JOB_TYPE_LABEL_MAP,
} from "@/shared/constants/workload.constant";

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
  // 최소 너비 보장 (백분율) - 개수와 퍼센트를 표시하기 위한 최소 공간
  const MIN_WIDTH_PERCENT = 15;
  const totalItems = data.reduce((sum, item) => sum + item.count, 0);

  // 각 세그먼트가 최소 너비를 가지도록 조정
  const segments = data.map((item) => {
    const naturalWidth = totalItems > 0 ? (item.count / totalItems) * 100 : 0;
    const adjustedWidth = Math.max(naturalWidth, MIN_WIDTH_PERCENT);
    return {
      ...item,
      naturalWidth,
      adjustedWidth,
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
              <Dot $color={segment.color} />
              <LegendText>{segment.label}</LegendText>
            </LegendItem>
          ))}
        </LegendGroup>
      }
    >
      <ContentBox>
        <SegmentRow>
          {segments.map((segment) => (
            <SegmentInfo key={segment.type} $width={segment.naturalWidth}>
              <CountText>{segment.count}개</CountText>
              <PercentText>({segment.percentage}%)</PercentText>
            </SegmentInfo>
          ))}
        </SegmentRow>

        <ProgressBarContainer>
          {segments.map((segment, index) => (
            <ProgressSegment
              key={segment.type}
              $color={segment.color}
              $width={segment.naturalWidth}
              $isFirst={index === 0}
              $isLast={index === segments.length - 1}
            />
          ))}
        </ProgressBarContainer>
      </ContentBox>
    </Card>
  );
}

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

const LegendText = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  color: #222222;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 12px;
  gap: 8px;
  width: 100%;
`;

const SegmentRow = styled.div`
  display: flex;
  width: 100%;
`;

const SegmentInfo = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;
  padding-left: 10px;

  &:not(:first-child) {
    border-left: 1px solid #e5e5e5;
  }
`;

const CountText = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: #000000;
  font-weight: 700;
`;

const PercentText = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  color: #000000;
  font-size: 11px;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #ffffff;
`;

const ProgressSegment = styled.div<{
  $color: string;
  $width: number;
  $isFirst: boolean;
  $isLast: boolean;
}>`
  position: relative;
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${({ $isFirst }) => ($isFirst ? 0 : 1)}px;
    right: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
    background-color: ${({ $color }) => $color};
    border-radius: ${({ $isFirst, $isLast }) => {
      if ($isFirst && $isLast) return "3px";
      if ($isFirst) return "3px 0 0 3px";
      if ($isLast) return "0 3px 3px 0";
      return "0";
    }};
  }
`;
