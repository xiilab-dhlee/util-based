"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import {
  getGetImageJobsQueryKey,
  useRestartImageJob,
} from "@/api/generated/image-job/image-job";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function RestartRegistryModal() {
  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useRestartImageJob();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (imageTagId === null) return;

    mutate(
      { imageTagId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetImageJobsQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe(REGISTRY_EVENTS.openRestartJobModal, (id: number) => {
    setImageTagId(id);
    setOpen(true);
  });

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="재시작"
      title="컨테이너 이미지 등록 재시작"
      showCancelButton
      centered
      closable
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>컨테이너 이미지 등록을 재시작하시겠습니까?</div>
    </Modal>
  );
}
