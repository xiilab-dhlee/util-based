"use client";

import styled from "styled-components";

import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { GpuUtilizationTooltipTitle } from "@/shared/components/tooltip-title/gpu-utilization-tooltip-title";
import { mapToChartData } from "@/shared/utils/chart.util";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";
import { statusTextStyle } from "@/styles/mixins/text";

/**
 * 워크로드 모니터링 카드 컴포넌트의 Props 인터페이스
 */
interface SystemMonitoringCardProps {
  /** 모니터링할 메트릭 타입 (CPU, 메모리, GPU 등) */
  type: MonitoringMetricType;
}

/**
 * 워크로드의 특정 메트릭(CPU, 메모리, GPU 등)을 실시간으로 모니터링하는 카드 컴포넌트
 */
export function SystemMonitoringCard({ type }: SystemMonitoringCardProps) {
  /**
   * 데모 모니터링 데이터를 차트 시리즈로 변환
   * ChartUtil.mapToChartData를 활용하여 UserMonitoringNodeGpuLineChart와 동일한
   * 형태의 area 차트 데이터를 생성합니다.
   */
  const series = mapToChartData(undefined, "area");

  /**
   * 메트릭 타입에 따른 모니터링 정보 조회
   * Workload를 통해 type에 맞는 텍스트, 단위, 색상 정보를 가져옵니다.
   */
  const { text, unit, color } = getMetricInfo(type);

  return (
    <LikeCompactCardContainer>
      <LikeCompactCardHeader>
        {/* 메트릭 이름 표시 - 텍스트가 길 경우 말줄임표 처리 */}
        <LikeCompactCardTitle className="truncate">
          {text}
          <GuideTooltip title={<GpuUtilizationTooltipTitle />} />
        </LikeCompactCardTitle>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        {/* 차트 데이터가 있을 경우에만 모니터링 차트 렌더링 */}
        {series.length > 0 && (
          <MonitoringChart
            height={290}
            series={series}
            unit={unit}
            colors={[color]}
          />
        )}
        <Legend>
          <Series>
            <SeriesText color="#A75BFF">NVDIA TITAN Xp-1</SeriesText>
          </Series>
          <Series>
            <SeriesText color="#5398FF">NVDIA TITAN Xp-2</SeriesText>
          </Series>
          <Series>
            <SeriesText color="#2DC598">NVDIA TITAN Xp-3</SeriesText>
          </Series>
          <Series>
            <SeriesText color="#FFD129">NVDIA TITAN Xp-4</SeriesText>
          </Series>
        </Legend>
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}

const Legend = styled.div`
  margin: 0 20px 8px 20px;
  background-color: #f7f9fb;
  border: 1px solid #d1d5dc;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Series = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  & + & {
    border-left: 1px solid #d1d5dc;
  }
`;

const SeriesText = styled.span<{ color: string }>`
  ${statusTextStyle(6)}

  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #313131;
  margin-left: 9px;

  &::before {
    background-color: ${({ color }) => color};
  }
`;
