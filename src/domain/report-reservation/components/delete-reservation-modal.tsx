"use client";

import { useCallback, useState } from "react";
import { Modal } from "xiilab-ui";

import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { openDeleteReservationModalAtom } from "@/domain/report-reservation/state/reservation.atom";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 예약 삭제 모달 컴포넌트
 *
 * 선택한 리포트 예약을 삭제할 수 있는 모달입니다.
 */
export function DeleteReservationModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteReservationModalAtom,
  );

  // 삭제할 예약 ID
  const [deleteReservationId, setDeleteReservationId] = useState<
    ReservationListType["id"] | null
  >(null);

  /**
   * 확인 버튼 클릭 핸들러
   *
   * 예약 삭제를 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (!deleteReservationId) {
      return;
    }

    // TODO: 예약 삭제 API 호출
    console.log("Delete reservation:", deleteReservationId);
    // 상태 초기화
    setDeleteReservationId(null);

    // 모달 닫기
    onClose();
  };

  /**
   * 예약 삭제 모달 데이터 수신 핸들러
   *
   * 삭제할 예약 ID를 설정하고 모달을 엽니다.
   */
  const handleDeleteReservationReceive = useCallback(
    (reservationId: ReservationListType["id"]) => {
      setDeleteReservationId(reservationId);
      onOpen();
    },
    [onOpen],
  );

  // 예약 삭제 모달 데이터 구독
  useSubscribe(
    RESERVATION_EVENTS.sendDeleteReservation,
    handleDeleteReservationReceive,
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="리포트 예약 삭제"
      centered
    >
      <div>해당 리포트 예약을 삭제 하시겠습니까?</div>
    </Modal>
  );
}
