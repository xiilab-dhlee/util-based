"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetPrivateImageTagListQueryKey,
  useDeletePrivateImageTags,
} from "@/api/generated/private-registry/private-registry";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeletePrivateRegistryTagModal() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const [open, setOpen] = useState(false);
  const [deleteTags, setDeleteTags] = useState<number[]>([]);

  const { mutate, isPending } = useDeletePrivateImageTags();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (deleteTags.length === 0) return;

    mutate(
      {
        data: { harborTagId: deleteTags },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          toast.success("이미지 태그 삭제 완료");
          setOpen(false);
          router.replace(ROUTES.USER_PRIVATE_REGISTRY_DETAIL(harborImageName));
        },
      },
    );
  };

  useSubscribe(PRIVATE_REGISTRY_EVENTS.openDeleteTagModal, (tags: number[]) => {
    setDeleteTags(tags);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="태그 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 태그를 삭제하시겠습니까?</div>
    </Modal>
  );
}
