"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdateUrgentStandbyOrderAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ReorderData {
  workloadName: string;
  oldRank: number;
  newRank: number;
  reorderedList: QueueWorkloadResponse[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReorderUrgentQueueConfirmModal() {
  const [open, setOpen] = useState(false);
  const [reorderData, setReorderData] = useState<ReorderData | null>(null);
  const { mutate: updateOrder, isPending } =
    useUpdateUrgentStandbyOrderAction();

  const handleOk = () => {
    if (!reorderData || isPending) return;

    updateOrder(
      {
        data: {
          queueOrderItem: reorderData.reorderedList.map((w, idx) => ({
            rank: idx + 1,
            workspaceResourceName: w.workspaceResourceName,
            workloadResourceName: w.workloadResourceName,
          })),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setReorderData(null);
          reorderData.onSuccess?.();
        },
        onError: () => {
          reorderData.onCancel?.();
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
    reorderData?.onCancel?.();
    setReorderData(null);
  };

  useSubscribe<ReorderData>(
    SCHEDULING_QUEUE_EVENTS.openReorderConfirmModal,
    (data) => {
      setReorderData(data);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="error"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="순서 변경 확인"
      centered
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      긴급 대기열 간 순서를 변경하시겠습니까?
      <br />
      변경한 순서는 즉시 반영됩니다.
    </Modal>
  );
}
