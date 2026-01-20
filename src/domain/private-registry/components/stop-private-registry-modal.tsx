"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import {
  getGetImageJobsQueryKey,
  useDeleteImageJob,
} from "@/api/generated/image-job/image-job";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function StopPrivateRegistryModal() {
  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { mutate: deleteJob, isPending } = useDeleteImageJob();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (imageTagId === null) {
      toast.error("컨테이너 이미지를 선택해 주세요.");
      return;
    }

    if (isPending) {
      return;
    }

    deleteJob(
      { imageTagId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetImageJobsQueryKey(),
          });
          setOpen(false);
          toast.success("컨테이너 이미지 등록 종료 요청이 완료되었습니다.");
        },
      },
    );
  };

  useSubscribe(PRIVATE_REGISTRY_EVENTS.sendStopImageJob, (id: number) => {
    setImageTagId(id);
    setOpen(true);
  });

  return (
    <Modal
      type="danger"
      icon={<Icon name="PowerBold" color="#fff" size={18} />}
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText="종료"
      title="컨테이너 이미지 등록 종료"
      showCancelButton
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>컨테이너 이미지 등록을 종료하시겠습니까?</div>
    </Modal>
  );
}
