"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";
import { getMetricInfo } from "@/domain/monitoring/utils/monitoring.util";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { mapToChartData } from "@/shared/utils/chart.util";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";

/**
 * 워크로드 모니터링 카드 컴포넌트의 Props 인터페이스
 */
interface WorkloadMonitoringCardProps {
  /** 모니터링할 메트릭 타입 (CPU, 메모리, GPU 등) */
  type: MonitoringMetricType;
}

// 데모 모니터링 데이터 생성
const generateDemoData = () => {
  const now = new Date();
  const dataPoints = [];

  // 최근 60개의 데이터 포인트 생성 (5분 간격, 총 5시간)
  for (let i = 59; i >= 0; i--) {
    const dateTime = new Date(now.getTime() - i * 5 * 60000); // 5분 간격
    dataPoints.push({
      dateTime: dateTime.toISOString(),
      value: Math.floor(Math.random() * 30) + 40, // 40-70 사이의 랜덤 값
    });
  }

  return [
    {
      modelName: "workload-1",
      gpuIndex: 0,
      valueDTOS: dataPoints,
    },
  ];
};

/**
 * 워크로드의 특정 메트릭(CPU, 메모리, GPU 등)을 실시간으로 모니터링하는 카드 컴포넌트
 */
export function WorkloadMonitoringCard({ type }: WorkloadMonitoringCardProps) {
  // PubSub 이벤트 발행을 위한 훅
  const publish = usePublish();

  /**
   * 데모 모니터링 데이터를 차트 시리즈로 변환
   * ChartUtil.mapToChartData를 활용하여 UserMonitoringNodeGpuLineChart와 동일한
   * 형태의 area 차트 데이터를 생성합니다.
   */
  const demoData = generateDemoData();
  const series = mapToChartData(demoData, "area");

  /**
   * 메트릭 타입에 따른 모니터링 정보 조회
   * Workload를 통해 type에 맞는 텍스트, 단위, 색상 정보를 가져옵니다.
   */
  const { text, unit, colors } = getMetricInfo(type);

  /**
   * 확대 아이콘 클릭 핸들러
   *
   * 사용자가 확대 버튼을 클릭했을 때 실행되며:
   * 1. PubSub 시스템을 통해 모니터링 데이터를 모달과 동기화
   * 2. 모달을 열어 상세 모니터링 차트를 표시
   *
   * 전달되는 데이터:
   * - title: 메트릭 이름 (차트 제목으로 사용)
   * - series: 차트 시리즈 데이터
   * - unit: 데이터 단위
   * - colors: 차트 색상 배열
   */
  const handleClickIcon = () => {
    // 모달과 데이터 동기화를 위한 PubSub 이벤트 발행
    publish(WORKLOAD_EVENTS.sendWorkloadMonitoring, {
      title: text,
      series,
      unit,
      colors,
    });
  };

  return (
    <LikeCompactCardContainer data-testid={WORKLOAD_SELECTOR.monitoringChart(type)}>
      <LikeCompactCardHeader>
        <LikeCompactCardTitle className="truncate">{text}</LikeCompactCardTitle>
        <IconButton type="button" onClick={handleClickIcon}>
          <Icon name="Size02" color="var(--icon-fill)" size={16} />
          <span className="sr-only">모니터링 차트 확대</span>
        </IconButton>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        {/* 차트 데이터가 있을 경우에만 모니터링 차트 렌더링 */}
        {series.length > 0 && (
          <MonitoringChart
            series={series}
            height={290}
            unit={unit}
            colors={colors}
          />
        )}
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
