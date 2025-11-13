import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openDeleteRegistryImageModalAtom } from "@/atoms/registry/private-registry-image-detail.atom";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useDeletePrivateRegistryImage } from "@/hooks/registry/use-delete-private-registry-image";
import type { DeletePrivateRegistryImagePayload } from "@/types/registry/registry.interface";

export function DeleteRegistryImageModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteRegistryImageModalAtom,
  );

  // 삭제에 필요한 정보
  const [registryName, setRegistryName] = useState<string>("");
  const [imageId, setImageId] = useState<number>(-1);

  const deletePrivateRegistryImage = useDeletePrivateRegistryImage();

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

  /**
   * 삭제 모달 데이터 구독
   */
  useSubscribe<DeletePrivateRegistryImagePayload>(
    pubsubConstants.registry.sendDeletePrivateRegistryImage,
    (payload: DeletePrivateRegistryImagePayload) => {
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

