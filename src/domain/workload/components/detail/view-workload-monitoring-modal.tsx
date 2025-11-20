import type { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { openViewWorkloadMonitoringModalAtom } from "@/domain/workload/state/workload.atom";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 워크로드 모니터링 데이터 동기화를 위한 페이로드 타입
 */
type SyncWorkloadMonitoringPayload = {
  /** 모달 제목 */
  title: string;
  /** 차트에 표시할 데이터 시리즈 배열 */
  series: ApexOptions["series"];
  /** 데이터 단위 (예: %, MB, GB 등) */
  unit: string;
  /** 차트 색상 배열 */
  colors: string[];
};

/**
 * 워크로드 모니터링 데이터를 실시간 차트로 표시하는 모달 컴포넌트
 *
 * 이 컴포넌트는 PubSub 시스템을 통해 워크로드 모니터링 데이터를 구독하고,
 * 수신된 데이터를 MonitoringChart 컴포넌트를 통해 시각화합니다.
 *
 * 주요 기능:
 * - PubSub 이벤트 구독을 통한 실시간 데이터 수신
 * - 동적 모달 제목 및 차트 데이터 업데이트
 * - 데이터가 있을 때만 차트 렌더링
 * - Jotai 상태 관리를 통한 모달 열기/닫기 제어
 *
 * 사용법:
 * 1. openViewWorkloadMonitoringModalAtom을 true로 설정하여 모달 열기
 * 2. WORKLOAD_EVENTS.sendWorkloadMonitoring 이벤트로 데이터 전송
 * 3. 모달이 자동으로 데이터를 수신하고 차트 업데이트
 *
 * @returns 워크로드 모니터링 모달 JSX 요소
 */
export function ViewWorkloadMonitoringModal() {
  // 모달 내부 상태 관리
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState<ApexOptions["series"]>([]);
  const [unit, setUnit] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openViewWorkloadMonitoringModalAtom,
  );

  /**
   * 워크로드 모니터링 데이터 구독
   * WORKLOAD_EVENTS.sendWorkloadMonitoring 이벤트를 구독하여
   * 실시간으로 모니터링 데이터를 수신하고 상태를 업데이트합니다.
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendWorkloadMonitoring,
    (eventData: SyncWorkloadMonitoringPayload) => {
      setTitle(eventData.title);
      setSeries(eventData.series);
      setUnit(eventData.unit);
      setColors(eventData.colors);
      // 모달 열기
      onOpen();
    },
  );

  return (
    <InfoModal
      modalWidth={800}
      title={title}
      icon={<Icon name="Monitoring01" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      showHeaderBorder
      centered
    >
      {/* 데이터가 있을 때만 차트를 렌더링하여 불필요한 렌더링 방지 */}
      {series && series.length > 0 && (
        <MonitoringChart
          // 제목으로 각 차트 데이터 구분
          key={title}
          series={series}
          height={340}
          unit={unit}
          colors={colors}
        />
      )}
    </InfoModal>
  );
}
