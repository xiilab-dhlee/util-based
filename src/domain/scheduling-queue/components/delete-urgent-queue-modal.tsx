"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useGetUrgentStandbyWorkloads } from "@/api/generated/admin-queue/admin-queue";
import type { QueueWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdateUrgentStandbyOrderAction } from "@/domain/scheduling-queue/hooks/scheduling-queue-actions";
import { SCHEDULING_QUEUE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeleteUrgentQueueModal() {
  const [open, setOpen] = useState(false);
  const [workloadToDelete, setWorkloadToDelete] =
    useState<QueueWorkloadResponse | null>(null);

  const { data: urgentData } = useGetUrgentStandbyWorkloads();
  const { mutate: updateOrder, isPending } =
    useUpdateUrgentStandbyOrderAction();

  const workloads = urgentData || [];

  const handleOk = () => {
    if (!workloadToDelete || isPending) return;

    const remainingWorkloads = workloads.filter(
      (w) => w.workloadResourceName !== workloadToDelete.workloadResourceName,
    );

    updateOrder(
      {
        data: {
          queueOrderItem: remainingWorkloads.map((w, index) => ({
            workloadId: w.workloadId,
            rank: index + 1,
          })),
        },
      },
      {
        onSuccess: () => {
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
