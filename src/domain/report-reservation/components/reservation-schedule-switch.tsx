"use client";

import { Switch } from "xiilab-ui";

import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface ReservationScheduleSwitchProps {
  id: ReservationListType["id"];
  isScheduled: boolean;
}

/**
 * 예약발송 스위치 컴포넌트
 * 클릭 시 확인 모달을 띄우기 위해 pubsub 이벤트를 발행합니다.
 */
export function ReservationScheduleSwitch({
  id,
  isScheduled,
}: ReservationScheduleSwitchProps) {
  const publish = usePublish();

  const handleChange = (checked: boolean) => {
    publish(RESERVATION_EVENTS.sendToggleReservationSchedule, {
      id,
      isScheduled: checked,
    });
  };

  return <Switch checked={isScheduled} onChange={handleChange} />;
}
