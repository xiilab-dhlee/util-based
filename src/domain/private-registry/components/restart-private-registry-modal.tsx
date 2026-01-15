"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetImageJobsQueryKey,
  useRestartImageJob,
} from "@/api/generated/image-job/image-job";
import { openRestartPrivateRegistryModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function RestartPrivateRegistryModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openRestartPrivateRegistryModalAtom,
  );
  const [imageTagId, setImageTagId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { mutate: restartJob, isPending } = useRestartImageJob();

  const handleOk = () => {
    if (imageTagId === null) {
      toast.error("컨테이너 이미지를 선택해 주세요.");
      return;
    }

    if (isPending) {
      return;
    }

    restartJob(
      { imageTagId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetImageJobsQueryKey(),
          });
          onClose();
          toast.success("컨테이너 이미지 등록 재시작 요청이 완료되었습니다.");
        },
      },
    );
  };

  useSubscribe(PRIVATE_REGISTRY_EVENTS.sendRestartImageJob, (id: number) => {
    setImageTagId(id);
    onOpen();
  });

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="재시작"
      title="컨테이너 이미지 등록 재시작"
      showCancelButton
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>컨테이너 이미지 등록을 재시작하시겠습니까?</div>
    </Modal>
  );
}
