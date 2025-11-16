import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openDeletePrivateRegistryImageModalAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useDeletePrivateRegistryImage } from "@/hooks/private-registry-image/use-delete-private-registry-image";

export function DeletePrivateRegistryImageModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeletePrivateRegistryImageModalAtom,
  );

  // 삭제에 필요한 정보
  const [ids, setIds] = useState<number[]>([]);

  const deletePrivateRegistryImage = useDeletePrivateRegistryImage();

  /**
   * 폼 제출 처리 함수
   *
   * 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (ids.length === 0) {
      toast.error("삭제할 컨테이너 이미지를 선택해 주세요.");
      return;
    }

    // 삭제 실행
    deletePrivateRegistryImage.mutate(ids, {
      onSuccess: () => {
        toast.success("컨테이너 이미지 삭제 완료");
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 삭제 모달 데이터 구독
   */
  useSubscribe(
    PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteImage,
    (ids: number[]) => {
      setIds(ids);
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
