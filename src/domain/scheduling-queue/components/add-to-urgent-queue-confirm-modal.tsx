"use client";

import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MAX_URGENT_QUEUE_SIZE } from "@/domain/scheduling-queue/constants/scheduling-queue.constant";
import { useAddWorkloadToUrgentStandbyAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import { pendingWorkloadPageAtom } from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface AddToQueueData {
  workload: AdminWorkloadResponse;
  onSuccess?: () => void;
}

export function AddToUrgentQueueConfirmModal() {
  const [open, setOpen] = useState(false);
  const [addData, setAddData] = useState<AddToQueueData | null>(null);
  const resetPendingPage = useResetAtom(pendingWorkloadPageAtom);
  const { mutate: addToQueue, isPending } =
    useAddWorkloadToUrgentStandbyAction();

  const handleOk = () => {
    if (!addData || isPending) return;

    addToQueue(
      {
        data: {
          workspaceResourceName: addData.workload.workspaceResourceName,
          workloadResourceName: addData.workload.workloadResourceName,
        },
      },
      {
        onSuccess: () => {
          resetPendingPage();
          setOpen(false);
          setAddData(null);
          addData.onSuccess?.();
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
    setAddData(null);
  };

  useSubscribe<AddToQueueData>(
    SCHEDULING_QUEUE_EVENTS.openAddToQueueConfirmModal,
    (data) => {
      setAddData(data);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="confirm"
      icon={<Icon name="Plus" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="긴급 대기열 등록"
      centered
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      해당 워크로드를 긴급 대기열에 등록하시겠습니까?
      <br />
      긴급 대기열은 최대 {MAX_URGENT_QUEUE_SIZE}개까지 등록 가능합니다.
    </Modal>
  );
}
