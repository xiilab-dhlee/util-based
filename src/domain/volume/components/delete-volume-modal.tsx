"use client";

import { useState } from "react";
import { Modal } from "xiilab-ui";

import { useDeleteVolume } from "@/domain/volume/hooks/use-delete-volume";
import type { VolumeIdType } from "@/domain/volume/schemas/volume.schema";
import { openDeleteVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 볼륨 삭제 모달 컴포넌트
 *
 * 선택한 볼륨을 삭제할 수 있는 모달입니다.
 */
export function DeleteVolumeModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteVolumeModalAtom);

  // 삭제할 볼륨 목록
  const [deleteVolumes, setDeleteVolumes] = useState<VolumeIdType[]>([]);

  const deleteVolume = useDeleteVolume();

  /**
   * 폼 제출 처리 함수
   *
   * 볼륨 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    // 볼륨 삭제 실행
    deleteVolume.mutate(deleteVolumes, {
      onSuccess: () => {
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 볼륨 삭제 모달 데이터 구독
   */
  useSubscribe(VOLUME_EVENTS.sendDeleteVolume, (volumes: VolumeIdType[]) => {
    // 삭제할 볼륨 목록 설정
    setDeleteVolumes(volumes);
    // 삭제 모달 열기
    onOpen();
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="볼륨 삭제"
      centered
      okButtonProps={{
        loading: deleteVolume.isPending,
      }}
    >
      <div>선택한 볼륨을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 볼륨은 복구되지 않습니다.</div>
    </Modal>
  );
}
