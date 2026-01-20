import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetPrivateRegistryListQueryKey,
  useDeletePrivateImages,
} from "@/api/generated/private-registry/private-registry";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeletePrivateRegistryModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteRegistries, setDeleteRegistries] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { mutate: deleteImages, isPending } = useDeletePrivateImages();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (deleteRegistries.length === 0) {
      toast.error("삭제할 이미지를 선택해 주세요.");
      return;
    }

    if (isPending) {
      return;
    }

    deleteImages(
      {
        data: { harborImageNames: deleteRegistries },
      },
      {
        onSuccess: () => {
          // 개인 레지스트리 이미지 목록 갱신
          queryClient.invalidateQueries({
            queryKey: getGetPrivateRegistryListQueryKey(),
          });
          // 모달 닫기
          setOpen(false);
          router.replace(ROUTES.USER_PRIVATE_REGISTRY);
          // 성공 메시지 표시
          toast.success("개인 레지스트리 이미지 삭제 완료");
        },
      },
    );
  };

  useSubscribe<string[]>(
    PRIVATE_REGISTRY_EVENTS.sendDeletePrivateRegistry,
    (registries) => {
      setDeleteRegistries(registries);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
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
