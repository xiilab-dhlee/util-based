"use client";

import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import {
  notificationCheckedListAtom,
  openDeleteNotificationModalAtom,
} from "@/domain/notification/state/notification.atom";
import { NOTIFICATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 알림 삭제 모달 컴포넌트
 *
 * 선택한 알림을 삭제할 수 있는 모달입니다.
 */
export function DeleteNotificationModal() {
  const router = useRouter();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteNotificationModalAtom,
  );

  // 체크박스 초기화
  const resetCheckedList = useResetAtom(notificationCheckedListAtom);

  // 삭제할 알림 ID 목록
  const [deleteNotificationIds, setDeleteNotificationIds] = useState<string[]>(
    [],
  );

  /**
   * 폼 제출 처리 함수
   *
   * 알림 삭제를 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (deleteNotificationIds.length === 0) return;

    // TODO: 삭제 API 연동
    console.log("Delete notifications:", deleteNotificationIds);

    // 체크박스 초기화
    resetCheckedList();
    // 모달 닫기
    onClose();
    // 목록 페이지로 이동
    router.replace(ROUTES.ADMIN_NOTIFICATION);
  };

  /**
   * 알림 삭제 모달 데이터 구독
   * 단일 ID (string) 또는 여러 ID (string[])를 받을 수 있음
   */
  useSubscribe(
    NOTIFICATION_EVENTS.sendDeleteNotification,
    (notificationIds: string | string[]) => {
      // 삭제할 알림 ID 목록 설정 (단일 ID도 배열로 변환)
      const ids = Array.isArray(notificationIds)
        ? notificationIds
        : [notificationIds];
      setDeleteNotificationIds(ids);
      // 삭제 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="알림 내역 삭제"
      centered
    >
      <div>선택한 알림 상세를 삭제하시겠습니까?</div>
    </Modal>
  );
}
