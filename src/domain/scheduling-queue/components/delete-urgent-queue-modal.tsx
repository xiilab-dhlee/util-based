"use client";

import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useRemoveWorkloadFromUrgentStandbyAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import { pendingWorkloadPageAtom } from "@/domain/scheduling-queue/state/scheduling-queue.atom";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeleteUrgentQueueModal() {
  const [open, setOpen] = useState(false);
  const [workloadToDelete, setWorkloadToDelete] =
    useState<QueueWorkloadResponse | null>(null);
  const resetPendingPage = useResetAtom(pendingWorkloadPageAtom);

  const { mutate: removeWorkload, isPending } =
    useRemoveWorkloadFromUrgentStandbyAction();

  const handleOk = () => {
    if (!workloadToDelete || isPending) return;

    removeWorkload(
      {
        data: {
          workspaceResourceName: workloadToDelete.workspaceResourceName,
          workloadResourceName: workloadToDelete.workloadResourceName,
        },
      },
      {
        onSuccess: () => {
          resetPendingPage();
          setOpen(false);
          setWorkloadToDelete(null);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
    setWorkloadToDelete(null);
  };

  useSubscribe<QueueWorkloadResponse>(
    SCHEDULING_QUEUE_EVENTS.openDeleteUrgentQueueModal,
    (workload) => {
      setWorkloadToDelete(workload);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="danger"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="긴급 대기열 삭제"
      centered
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      긴급 대기열에서 삭제하시겠습니까?
      <br />
      삭제 시 일반 대기열로 복귀합니다.
    </Modal>
  );
}
