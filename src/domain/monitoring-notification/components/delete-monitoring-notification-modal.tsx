"use client";

import { useState } from "react";
import { Modal } from "xiilab-ui";

import { useDeleteNotificationAction } from "@/domain/monitoring-notification/hooks/monitoring-notification-action";
import { openDeleteMonitoringNotificationModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeleteMonitoringNotificationModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteMonitoringNotificationModalAtom,
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = useDeleteNotificationAction({
    mutation: {
      onSuccess: () => {
        onClose();
      },
    },
  });

  useSubscribe(
    MONITORING_EVENTS.sendDeleteNotification,
    ({ id }: { id: number }) => {
      setDeleteId(id);
      onOpen();
    },
  );

  const handleOk = () => {
    if (deleteId !== null) {
      deleteMutation.mutate({ notificationSetId: deleteId });
    }
  };

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="모니터링 알림 삭제"
      okButtonProps={{ loading: deleteMutation.isPending }}
      centered
    >
      <div>해당 모니터링 알림을 삭제하시겠습니까?</div>
    </Modal>
  );
}
