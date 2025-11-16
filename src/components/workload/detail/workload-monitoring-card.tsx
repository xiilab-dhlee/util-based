"use client";

import { MonitoringChart } from "@/components/common/chart/monitoring-chart";
import { MyIcon } from "@/components/common/icon";
import { WORKLOAD_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardTitle,
} from "@/styles/layers/like-card-layers.styled";
import type { MonitoringMetricType } from "@/types/monitoring/monitoring.type";
import { mapToChartData } from "@/utils/common/chart.util";
import { getMetricInfo } from "@/utils/monitoring/monitoring.util";

/**
 * ?�크로드 모니?�링 카드 컴포?�트??Props ?�터?�이??
 */
interface WorkloadMonitoringCardProps {
  /** 모니?�링??메트�??�??(CPU, 메모�? GPU ?? */
  type: MonitoringMetricType;
}

/**
 * ?�크로드???�정 메트�?CPU, 메모�? GPU ?????�시간으�?모니?�링?�는 카드 컴포?�트
 */
export function WorkloadMonitoringCard({ type }: WorkloadMonitoringCardProps) {
  // PubSub ?�벤??발행???�한 ??
  const publish = usePublish();

  /**
   * ?�모 모니?�링 ?�이?��? 차트 ?�리즈로 변??
   * ChartUtil.mapToChartData�??�용?�여 DashboardNodeGpuLineChart?� ?�일??
   * ?�태??area 차트 ?�이?��? ?�성?�니??
   */
  const series = mapToChartData(undefined, "area");

  /**
   * 메트�??�?�에 ?�른 모니?�링 ?�보 조회
   * Workload�??�해 type??맞는 ?�스?? ?�위, ?�상 ?�보�?가?�옵?�다.
   */
  const { text, unit, color } = getMetricInfo(type);

  /**
   * ?��? ?�이�??�릭 ?�들??
   *
   * ?�용?��? ?��? 버튼???�릭?�을 ???�행?�며:
   * 1. PubSub ?�스?�을 ?�해 모니?�링 ?�이?��? 모달�??�기??
   * 2. 모달???�어 ?�세 모니?�링 차트�??�시
   *
   * ?�달?�는 ?�이??
   * - title: 메트�??�름 (차트 ?�목?�로 ?�용)
   * - series: 차트 ?�리�??�이??
   * - unit: ?�이???�위
   * - colors: 차트 ?�상 배열
   */
  const handleClickIcon = () => {
    // 모달�??�이???�기?��? ?�한 PubSub ?�벤??발행
    publish(WORKLOAD_EVENTS.sendWorkloadMonitoring, {
      title: text,
      series,
      unit,
      colors: [color],
    });
  };

  return (
    <LikeCompactCardContainer>
      <LikeCompactCardHeader>
        {/* 메트�??�름 ?�시 - ?�스?��? �?경우 말줄?�표 처리 */}
        <LikeCompactCardTitle className="truncate">{text}</LikeCompactCardTitle>
        {/* ?��? 버튼 - ?�릭 ???�세 모니?�링 모달 ?�기 */}
        <button type="button" onClick={handleClickIcon}>
          <MyIcon name="Size02" color="var(--icon-fill)" size={16} />
          <span className="sr-only">모니?�링 차트 ?��?</span>
        </button>
      </LikeCompactCardHeader>
      <LikeCompactCardBody>
        {/* 차트 ?�이?��? ?�을 경우?�만 모니?�링 차트 ?�더�?*/}
        {series.length > 0 && (
          <MonitoringChart series={series} unit={unit} colors={[color]} />
        )}
      </LikeCompactCardBody>
    </LikeCompactCardContainer>
  );
}
