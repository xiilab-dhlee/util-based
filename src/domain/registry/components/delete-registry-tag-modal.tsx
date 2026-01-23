"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import {
  getGetPrivateImageTagDetailQueryKey,
  getGetPrivateImageTagListQueryKey,
} from "@/api/generated/private-registry/private-registry";
import {
  getGetPublicImageTagDetailQueryKey,
  getGetPublicImageTagListQueryKey,
} from "@/api/generated/public-registry/public-registry";
import { useDeleteRegistryTagByMode } from "@/domain/registry/hooks/use-delete-registry-tag-by-mode";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteRegistryTagModalProps {
  mode: RegistryMode;
}

export function DeleteRegistryTagModal({ mode }: DeleteRegistryTagModalProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deleteTags, setDeleteTags] = useState<number[]>([]);

  const { mutate, isPending } = useDeleteRegistryTagByMode(mode);

  const handleCancel = () => {
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
          if (mode === "private") {
            queryClient.invalidateQueries({
              queryKey: getGetPrivateImageTagListQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetPrivateImageTagDetailQueryKey(),
            });
          } else if (mode === "public") {
            queryClient.invalidateQueries({
              queryKey: getGetPublicImageTagListQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetPublicImageTagDetailQueryKey(),
            });
          }
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<number[]>(REGISTRY_EVENTS.openDeleteTagModal, (tags) => {
    setDeleteTags(tags);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
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
