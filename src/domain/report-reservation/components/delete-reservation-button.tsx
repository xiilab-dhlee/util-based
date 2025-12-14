"use client";

import { Icon } from "xiilab-ui";

import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface DeleteReservationButtonProps {
  id: ReservationListType["id"];
}

/**
 * 예약 삭제 버튼 컴포넌트
 * 클릭 시 확인 모달을 띄우기 위해 pubsub 이벤트를 발행합니다.
 */
export function DeleteReservationButton({ id }: DeleteReservationButtonProps) {
  const publish = usePublish();

  const handleDelete = () => {
    publish(RESERVATION_EVENTS.sendDeleteReservation, id);
  };

  return (
    <ColumnIconWrap onClick={handleDelete} type="button">
      <Icon name="Delete" color="var(--icon-fill)" size={16} />
    </ColumnIconWrap>
  );
}
