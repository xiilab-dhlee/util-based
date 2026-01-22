"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import {
  getGetImageJobsQueryKey,
  useDeleteImageJob,
} from "@/api/generated/image-job/image-job";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function StopRegistryModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);

  const { mutate, isPending } = useDeleteImageJob();

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

  useSubscribe(REGISTRY_EVENTS.openStopJobModal, (id: number) => {
    setImageTagId(id);
    setOpen(true);
  });

  return (
    <Modal
      type="danger"
      icon={<Icon name="PowerBold" color="#fff" size={18} />}
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="종료"
      title="컨테이너 이미지 등록 종료"
      showCancelButton
      centered
      closable
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>컨테이너 이미지 등록을 종료하시겠습니까?</div>
    </Modal>
  );
}
