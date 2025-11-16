import { useState } from "react";
import { InfoModal } from "xiilab-ui";

import { openViewWorkloadMonitoringModalAtom } from "@/atoms/workload/workload-detail.atom";
import { MonitoringChart } from "@/components/common/chart/monitoring-chart";
import { MyIcon } from "@/components/common/icon";
import { WORKLOAD_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";

/**
 * ?�크로드 모니?�링 ?�이???�기?��? ?�한 ?�이로드 ?�??
 */
type SyncWorkloadMonitoringPayload = {
  /** 모달 ?�목 */
  title: string;
  /** 차트???�시???�이???�리�?배열 */
  series: any[];
  /** ?�이???�위 (?? %, MB, GB ?? */
  unit: string;
  /** 차트 ?�상 배열 */
  colors: string[];
};

/**
 * ?�크로드 모니?�링 ?�이?��? ?�시�?차트�??�시?�는 모달 컴포?�트
 *
 * ??컴포?�트??PubSub ?�스?�을 ?�해 ?�크로드 모니?�링 ?�이?��? 구독?�고,
 * ?�신???�이?��? MonitoringChart 컴포?�트�??�해 ?�각?�합?�다.
 *
 * 주요 기능:
 * - PubSub ?�벤??구독???�한 ?�시�??�이???�신
 * - ?�적 모달 ?�목 �?차트 ?�이???�데?�트
 * - ?�이?��? ?�을 ?�만 차트 ?�더�?
 * - Jotai ?�태 관리�? ?�한 모달 ?�기/?�기 ?�어
 *
 * ?�용�?
 * 1. openViewWorkloadMonitoringModalAtom??true�??�정?�여 모달 ?�기
 * 2. WORKLOAD_EVENTS.sendWorkloadMonitoring ?�벤?�로 ?�이???�송
 * 3. 모달???�동?�로 ?�이?��? ?�신?�고 차트 ?�데?�트
 *
 * @returns ?�크로드 모니?�링 모달 JSX ?�소
 */
export function ViewWorkloadMonitoringModal() {
  // 모달 ?��? ?�태 관�?
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState<any[]>([]);
  const [unit, setUnit] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  // useGlobalModal ?�을 ?�용?�여 모달 ?�태 관�?
  const { open, onOpen, onClose } = useGlobalModal(
    openViewWorkloadMonitoringModalAtom,
  );

  /**
   * ?�크로드 모니?�링 ?�이??구독
   * WORKLOAD_EVENTS.sendWorkloadMonitoring ?�벤?��? 구독?�여
   * ?�시간으�?모니?�링 ?�이?��? ?�신?�고 ?�태�??�데?�트?�니??
   */
  useSubscribe<SyncWorkloadMonitoringPayload>(
    WORKLOAD_EVENTS.sendWorkloadMonitoring,
    (eventData) => {
      setTitle(eventData.title);
      setSeries(eventData.series);
      setUnit(eventData.unit);
      setColors(eventData.colors);
      // 모달 ?�기
      onOpen();
    },
  );

  return (
    <InfoModal
      modalWidth={800}
      title={title}
      icon={<MyIcon name="Monitoring01" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      showHeaderBorder
      centered
    >
      {/* ?�이?��? ?�을 ?�만 차트�??�더링하??불필?�한 ?�더�?방�? */}
      {series.length > 0 && (
        <MonitoringChart
          // ?�목?�로 �?차트 ?�이??구분
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
