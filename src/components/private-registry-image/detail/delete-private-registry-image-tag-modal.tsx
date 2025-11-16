import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openDeletePrivateRegistryImageTagModalAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useDeletePrivateRegistryImageTag } from "@/hooks/private-registry-image/use-delete-private-registry-image-tag";

/**
 * 내부 레지스트리 이미지 태그 삭제 모달 컴포넌트
 *
 * 선택한 이미지 태그들을 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 데이터가 자동으로 갱신됩니다.
 */
export function DeletePrivateRegistryImageTagModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeletePrivateRegistryImageTagModalAtom,
  );

  // 삭제할 이미지 태그 목록
  const [deleteTagIds, setDeleteTagIds] = useState<number[]>([]);

  const deleteImageTag = useDeletePrivateRegistryImageTag();

  /**
   * 폼 제출 처리 함수
   *
   * 이미지 태그 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (deleteTagIds.length === 0) {
      toast.error("삭제할 태그를 선택해 주세요.");
      return;
    }

    // 이미지 태그 삭제 실행
    deleteImageTag.mutate(deleteTagIds, {
      onSuccess: () => {
        toast.success("이미지 태그 삭제 완료");
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 이미지 태그 삭제 모달 데이터 구독
   */
  useSubscribe(
    PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteImageTag,
    (tagIds: number[]) => {
      // 삭제할 이미지 태그 목록 설정
      setDeleteTagIds(tagIds);
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
      title="이미지 태그 삭제"
      centered
      okButtonProps={{
        loading: deleteImageTag.isPending,
      }}
    >
      <div>선택한 이미지 태그를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 태그는 복구되지 않습니다.</div>
    </Modal>
  );
}
