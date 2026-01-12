import { useQueryClient } from "@tanstack/react-query";
import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetPrivateRegistryListQueryKey,
  useDeleteImages,
} from "@/api/generated/private-registry/private-registry";
import {
  openDeletePrivateRegistryModalAtom,
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeletePrivateRegistryModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeletePrivateRegistryModalAtom,
  );
  const [deleteRegistries, setDeleteRegistries] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const resetPage = useResetAtom(privateregistryPageAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

  const { mutate: deleteImages, isPending } = useDeleteImages();

  const handleOk = () => {
    if (deleteRegistries.length === 0) {
      toast.error("삭제할 이미지를 선택해 주세요.");
      return;
    }

    if (isPending) {
      toast.error("요청 중입니다.");
      return;
    }

    deleteImages(
      {
        data: { harborImageNames: deleteRegistries },
      },
      {
        onSuccess: () => {
          resetCheckedList();
          resetPage();
          // 개인 레지스트리 이미지 목록 갱신
          queryClient.invalidateQueries({
            queryKey: getGetPrivateRegistryListQueryKey(),
          });
          // 모달 닫기
          onClose();
          // 성공 메시지 표시
          toast.success("개인 레지스트리 이미지 삭제 완료");
        },
      },
    );
  };

  useSubscribe(
    PRIVATE_REGISTRY_EVENTS.sendDeletePrivateRegistry,
    (registries: string[]) => {
      setDeleteRegistries(registries);
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="개인 레지스트리 이미지 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 개인 레지스트리 이미지와 포함된 태그를</div>
      <div>모두 삭제하시겠습니까?</div>
    </Modal>
  );
}
