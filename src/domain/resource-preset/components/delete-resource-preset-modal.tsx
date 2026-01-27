"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeletePresetsAction } from "@/domain/resource-preset/hooks/preset-action";
import { openDeleteResourcePresetModalAtom } from "@/domain/resource-preset/state/resource-preset.atom";
import { RESOURCE_PRESET_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 리소스 프리셋 삭제 모달 컴포넌트
 *
 * 선택한 리소스 프리셋을 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 목록 페이지로 이동합니다.
 */
export function DeleteResourcePresetModal() {
  const router = useRouter();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteResourcePresetModalAtom,
  );

  // 삭제할 리소스 프리셋 ID 목록
  const [deletePresetIds, setDeletePresetIds] = useState<number[]>([]);

  const deleteResourcePreset = useDeletePresetsAction();
  const okButtonProps = {
    loading: deleteResourcePreset.isPending,
  };

  /**
   * 모달 닫기 처리 함수
   *
   * 모달을 닫고 deletePresetId 상태를 초기화합니다.
   */
  const handleClose = () => {
    onClose();
    setDeletePresetIds([]);
  };

  /**
   * 폼 제출 처리 함수
   *
   * 리소스 프리셋 삭제를 실행하고 목록 페이지로 이동합니다.
   */
  const handleOk = () => {
    if (deletePresetIds.length === 0) {
      toast.error("삭제할 리소스 프리셋을 선택해 주세요.");
      return;
    }

    // 리소스 프리셋 삭제 실행
    deleteResourcePreset.mutate(
      { data: { resourcePresetIds: deletePresetIds } },
      {
        onSuccess: () => {
          // 모달 닫기 및 상태 초기화
          handleClose();
          // 목록 페이지로 이동
          router.push(ROUTES.ADMIN_RESOURCE_PRESET);
        },
      },
    );
  };

  /**
   * 리소스 프리셋 삭제 모달 데이터 구독
   */
  useSubscribe(
    RESOURCE_PRESET_EVENTS.sendDeleteResourcePreset,
    (payload: string | number | Array<string | number>) => {
      const idList = Array.isArray(payload) ? payload : [payload];
      const numericIds = idList
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0);

      if (numericIds.length === 0) {
        toast.error("삭제할 리소스 프리셋을 선택해 주세요.");
        return;
      }

      // 삭제할 리소스 프리셋 ID 설정
      setDeletePresetIds(numericIds);
      // 삭제 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="리소스 프리셋 삭제"
      centered
      okButtonProps={okButtonProps}
    >
      <div>
        선택된 {deletePresetIds.length}개의 리소스 프리셋을 삭제하시겠습니까?
      </div>
      <div>삭제 시 해당 리소스 프리셋은 복구되지 않습니다.</div>
    </Modal>
  );
}
