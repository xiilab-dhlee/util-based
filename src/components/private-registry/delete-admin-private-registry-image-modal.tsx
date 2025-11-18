import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openDeleteAdminRegistryImageModalAtom } from "@/atoms/private-registry-image.atom";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useDeleteAdminPrivateRegistryImage } from "@/hooks/private-registry-image/use-delete-admin-private-registry-image";
import type { DeleteAdminPrivateRegistryImagePayload } from "@/types/private-registry-image/private-registry-image.type";

export function DeleteAdminPrivateRegistryImageModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteAdminRegistryImageModalAtom,
  );

  // 삭제에 필요한 정보
  const [registryName, setRegistryName] = useState<string>("");
  const [imageId, setImageId] = useState<number>(-1);

  const deletePrivateRegistryImage = useDeleteAdminPrivateRegistryImage();

  /**
   * 폼 제출 처리 함수
   *
   * 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (!registryName || imageId === -1) {
      toast.error("삭제할 컨테이너 이미지를 선택해 주세요.");
      return;
    }

    // 삭제 실행
    deletePrivateRegistryImage.mutate(
      { registryName, imageId },
      {
        onSuccess: () => {
          toast.success("컨테이너 이미지 삭제 완료");
          // 모달 닫기
          onClose();
        },
      },
    );
  };

  useSubscribe(
    PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteAdminRegistryImage,
    (payload: DeleteAdminPrivateRegistryImagePayload) => {
      // 삭제할 컨테이너 이미지 정보 설정
      setRegistryName(payload.registryName);
      setImageId(payload.imageId);
      // 삭제 모달 열기
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
      title="컨테이너 이미지 삭제"
      centered
      okButtonProps={{
        loading: deletePrivateRegistryImage.isPending,
      }}
    >
      <div>선택한 컨테이너 이미지를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 컨테이너 이미지는 복구되지 않습니다.</div>
    </Modal>
  );
}
