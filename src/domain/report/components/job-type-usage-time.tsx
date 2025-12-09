"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type { WorkloadJobType } from "@/shared/constants/workload.constant";
import {
  WORKLOAD_JOB_TYPE_COLOR_MAP,
  WORKLOAD_JOB_TYPE_LABEL_MAP,
} from "@/shared/constants/workload.constant";

interface JobTypeData {
  type: WorkloadJobType;
  time: string;
  percentage: number;
}

interface JobTypeUsageTimeProps {
  data: JobTypeData[];
}

/**
 * Job Type별 사용 시간 분포 컴포넌트
 * 세그먼트 프로그레스 바로 각 Job Type 사용 시간 비율을 시각화
 */
export function JobTypeUsageTime({ data }: JobTypeUsageTimeProps) {
  // 최소 너비 보장 (백분율) - 시간과 퍼센트를 표시하기 위한 최소 공간
  const MIN_WIDTH_PERCENT = 15;

  // 각 세그먼트가 최소 너비를 가지도록 조정
  const segments = data.map((item) => {
    const adjustedWidth = Math.max(item.percentage, MIN_WIDTH_PERCENT);
    return {
      ...item,
      adjustedWidth,
      label: WORKLOAD_JOB_TYPE_LABEL_MAP[item.type],
      color: WORKLOAD_JOB_TYPE_COLOR_MAP[item.type],
    };
  });

  return (
    <Container>
      <Header>
        <Title>Job Type별 사용 시간</Title>
        <LegendGroup>
          {segments.map((segment) => (
            <LegendItem key={segment.type}>
              <Dot $color={segment.color} />
              <LegendText>{segment.label}</LegendText>
            </LegendItem>
          ))}
        </LegendGroup>
      </Header>

      <ContentBox>
        {segments.map((segment, index) => (
          <SegmentInfo key={segment.type} $width={segment.adjustedWidth}>
            <TimeText>{segment.time}</TimeText>
            <PercentText>({segment.percentage}%)</PercentText>
            {index > 0 && <VerticalDivider />}
          </SegmentInfo>
        ))}

        <ProgressBarContainer>
          {segments.map((segment, index) => (
            <ProgressSegment
              key={segment.type}
              $color={segment.color}
              $width={segment.adjustedWidth}
              $isFirst={index === 0}
              $isLast={index === segments.length - 1}
            />
          ))}
        </ProgressBarContainer>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #f7f9fb;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 16px 12px 12px 12px;
  box-shadow: 0px 4px 4px 0px rgba(171, 171, 171, 0.15),
    inset 0px 4px 4px 0px rgba(255, 255, 255, 0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: #191b26;
`;

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
  position: relative;
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  border: 1px solid #e9ebee;
  border-radius: 4px;
  padding: 12px;
  gap: 0;
  min-height: 82px;
`;

const SegmentInfo = styled.div<{ $width: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;
  padding-left: 10px;
`;

const TimeText = styled(Typography.Text).attrs({
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

const VerticalDivider = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 52px;
  background-color: #e5e5e5;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  height: 6px;
  display: flex;
  gap: 2px;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressSegment = styled.div<{
  $color: string;
  $width: number;
  $isFirst: boolean;
  $isLast: boolean;
}>`
  height: 100%;
  background-color: ${({ $color }) => $color};
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;
  border-radius: ${({ $isFirst, $isLast }) => {
    if ($isFirst && $isLast) return "3px";
    if ($isFirst) return "3px 0 0 3px";
    if ($isLast) return "0 3px 3px 0";
    return "0";
  }};
`;
