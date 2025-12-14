"use client";

import { useCallback, useState } from "react";
import { Modal } from "xiilab-ui";

import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { openToggleScheduleConfirmModalAtom } from "@/domain/report-reservation/state/reservation.atom";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/** 토글 스케줄 데이터 타입 */
interface ToggleScheduleData {
  id: ReservationListType["id"];
  isScheduled: boolean;
}

/**
 * 예약발송 토글 확인 모달 컴포넌트
 *
 * 예약발송 활성화/비활성화 전 사용자 확인을 받는 모달입니다.
 */
export function ToggleScheduleConfirmModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openToggleScheduleConfirmModalAtom,
  );

  // 토글할 예약 데이터
  const [toggleData, setToggleData] = useState<ToggleScheduleData | null>(null);

  /**
   * 확인 버튼 클릭 핸들러
   *
   * 예약발송 상태 변경을 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (!toggleData) {
      return;
    }

    // TODO: 예약발송 상태 변경 API 호출
    console.log("Toggle reservation schedule:", toggleData);

    // 모달 닫기
    onClose();
  };

  /**
   * 예약발송 토글 모달 데이터 수신 핸들러
   *
   * 토글할 예약 데이터를 설정하고 모달을 엽니다.
   */
  const handleToggleScheduleReceive = useCallback(
    (data: ToggleScheduleData) => {
      // 토글할 예약 데이터 설정
      setToggleData(data);
      // 모달 열기
      onOpen();
    },
    [onOpen],
  );

  /**
   * 예약발송 토글 모달 데이터 구독
   */
  useSubscribe(
    RESERVATION_EVENTS.sendToggleReservationSchedule,
    handleToggleScheduleReceive,
  );

  // 변경하려는 상태에 따른 메시지
  const actionText = toggleData?.isScheduled ? "활성화" : "비활성화";

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="예약 발송"
      centered
    >
      <div>예약 발송을 {actionText} 하시겠습니까?</div>
    </Modal>
  );
}
