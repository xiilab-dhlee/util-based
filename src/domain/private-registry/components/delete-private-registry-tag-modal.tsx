"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetPrivateImageTagListQueryKey,
  useDeleteImageTags1,
} from "@/api/generated/private-registry/private-registry";
import {
  openDeletePrivateRegistryTagModalAtom,
  privateregistryImageTagCheckedListAtom,
  privateregistryImageTagPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeletePrivateRegistryTagModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeletePrivateRegistryTagModalAtom,
  );
  const [deleteTags, setDeleteTags] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const resetPage = useResetAtom(privateregistryImageTagPageAtom);
  const resetCheckedList = useResetAtom(privateregistryImageTagCheckedListAtom);

  const { mutate: deleteImageTags, isPending } = useDeleteImageTags1();

  const handleOk = () => {
    if (deleteTags.length === 0) {
      toast.error("삭제할 태그를 선택해 주세요.");
      return;
    }

    if (isPending) {
      toast.error("요청 중입니다.");
      return;
    }

    deleteImageTags(
      {
        data: { harborTagId: deleteTags },
      },
      {
        onSuccess: () => {
          resetCheckedList();
          resetPage();
          // 이미지 태그 목록 갱신
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          // 모달 닫기
          onClose();
          // 성공 메시지 표시
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
      <div>내부 레지스트리 이미지의 선택된 태그를 삭제합니다.</div>
      <div>정말 삭제하시겠습니까?</div>
    </Modal>
  );
}
