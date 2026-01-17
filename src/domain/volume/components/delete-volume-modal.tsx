"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetVolumeListQueryKey,
  useDeleteVolume,
} from "@/api/generated/volume/volume";
import { openDeleteVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 볼륨 삭제 모달 컴포넌트
 *
 * 선택한 볼륨을 삭제할 수 있는 모달입니다.
 */
export function DeleteVolumeModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteVolumeModalAtom);

  // 삭제할 볼륨 목록
  const [deleteVolumeIds, setDeleteVolumeIds] = useState<number[]>([]);

  const deleteVolume = useDeleteVolume();

  /**
   * 폼 제출 처리 함수
   *
   * 볼륨 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = async () => {
    // 볼륨 순차 삭제 실행
    for (const volumeId of deleteVolumeIds) {
      await deleteVolume.mutateAsync({ volumeId });
    }
    toast.success("볼륨 삭제 성공");
    onClose();
    queryClient.invalidateQueries({
      queryKey: getGetVolumeListQueryKey(),
    });
    router.replace(ROUTES.USER_VOLUME);
  };

  const handleCancel = () => {
    if (deleteVolume.isPending) return;
    onClose();
  };

  /**
   * 볼륨 삭제 모달 데이터 구독
   */
  useSubscribe<number[]>(VOLUME_EVENTS.sendDeleteVolume, (volumeIds) => {
    // 삭제할 볼륨 목록 설정
    setDeleteVolumeIds(volumeIds);
    // 삭제 모달 열기
    onOpen();
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="볼륨 삭제"
      centered
      okButtonProps={{
        loading: deleteVolume.isPending,
      }}
      cancelButtonProps={{
        disabled: deleteVolume.isPending,
      }}
    >
      <div>선택한 볼륨을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 볼륨은 복구되지 않습니다.</div>
    </Modal>
  );
}
