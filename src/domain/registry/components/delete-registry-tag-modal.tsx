"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { getGetPrivateImageTagListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagListQueryKey } from "@/api/generated/public-registry/public-registry";
import { useDeleteRegistryTagByMode } from "@/domain/registry/hooks/use-delete-registry-tag-by-mode";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteRegistryTagModalProps {
  mode: RegistryMode;
}

export function DeleteRegistryTagModal({ mode }: DeleteRegistryTagModalProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const [open, setOpen] = useState(false);
  const [deleteTags, setDeleteTags] = useState<number[]>([]);

  const { mutate, isPending } = useDeleteRegistryTagByMode(mode);

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
          // private/public 캐시 모두 무효화
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetPublicImageTagListQueryKey(),
          });
          toast.success("이미지 태그 삭제 완료");
          setOpen(false);
          if (mode === "private") {
            router.replace(
              ROUTES.USER_PRIVATE_REGISTRY_DETAIL(harborImageName),
            );
          } else if (mode === "public") {
            router.replace(ROUTES.USER_PUBLIC_REGISTRY_DETAIL(harborImageName));
          }
        },
      },
    );
  };

  useSubscribe(REGISTRY_EVENTS.openDeleteTagModal, (tags: number[]) => {
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
