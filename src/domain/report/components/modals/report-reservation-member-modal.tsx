"use client";

import { useCallback, useState } from "react";

import { openReportReservationMemberModalAtom } from "@/domain/report/state/report.atom";
import type { MemberRow } from "@/shared/components/column/create-member-column";
import { MemberSelectionModal } from "@/shared/components/modal/member-selection-modal";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { SelectedMember } from "@/shared/types/member-selection.type";

/** 리포트 예약 멤버 모달 열기 페이로드 */
export interface OpenReportReservationMemberModalPayload {
  selectedAccounts: SelectedMember[];
}

/** 리포트 예약 멤버 선택 확인 페이로드 */
export interface ConfirmReportReservationMemberSelectionPayload {
  members: MemberRow[];
}

/**
 * 리포트 예약 멤버 추가 모달
 *
 * PubSub 패턴을 사용하여 ReportReservationModal과 상태를 공유합니다.
 */
export function ReportReservationMemberModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openReportReservationMemberModalAtom,
  );
  const publish = usePublish();

  const [initialAccounts, setInitialAccounts] = useState<
    OpenReportReservationMemberModalPayload["selectedAccounts"]
  >([]);

  const handleOpenMemberModal = useCallback(
    (payload: OpenReportReservationMemberModalPayload) => {
      setInitialAccounts(payload.selectedAccounts);
      onOpen();
    },
    [onOpen],
  );

  useSubscribe<OpenReportReservationMemberModalPayload>(
    RESERVATION_EVENTS.openMemberModal,
    handleOpenMemberModal,
  );

  const handleConfirm = (members: MemberRow[]) => {
    publish(RESERVATION_EVENTS.confirmMemberSelection, {
      members,
    });
  };

  return (
    <MemberSelectionModal
      open={open}
      title="멤버 추가"
      initialAccounts={initialAccounts}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
