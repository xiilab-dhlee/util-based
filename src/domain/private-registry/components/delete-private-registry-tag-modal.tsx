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
import { openDeletePrivateRegistryTagModalAtom } from "@/domain/private-registry/state/private-registry-tag.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeletePrivateRegistryTagModal() {
  const router = useRouter();
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const { open, onOpen, onClose } = useGlobalModal(
    openDeletePrivateRegistryTagModalAtom,
  );
  const [deleteTags, setDeleteTags] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const { mutate: deleteImageTags, isPending } = useDeletePrivateImageTags();

  const handleOk = () => {
    if (deleteTags.length === 0) {
      toast.error("삭제할 태그를 선택해 주세요.");
      return;
    }

    if (isPending) {
      return;
    }

    deleteImageTags(
      {
        data: { harborTagId: deleteTags },
      },
      {
        onSuccess: () => {
          // 이미지 태그 목록 갱신
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          // 이미지 상세 페이지로 이동
          onClose();
          router.replace(ROUTES.USER_PRIVATE_REGISTRY_DETAIL(harborImageName));
          toast.success("이미지 태그 삭제 완료");
        },
      },
    );
  };

  useSubscribe(PRIVATE_REGISTRY_EVENTS.sendDeleteImageTag, (tags: number[]) => {
    setDeleteTags(tags);
    onOpen();
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="태그 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택된 태그를 삭제합니다.</div>
      <div>정말 삭제하시겠습니까?</div>
    </Modal>
  );
}
