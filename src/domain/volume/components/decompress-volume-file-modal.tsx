"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDecompress } from "@/api/generated/volume/volume";
import {
  openDecompressVolumeFileModalAtom,
  volumeFileCheckedNodesAtom,
} from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ============================================================================
// Types
// ============================================================================

/** 압축 해제 모달 이벤트 데이터 */
interface DecompressVolumeFileEventData {
  volumeId: number;
  filePath: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 볼륨 파일 압축 해제 모달 컴포넌트
 *
 * 선택한 압축 파일을 해제할 수 있는 확인 모달입니다.
 */
export function DecompressVolumeFileModal() {
  // ---------------------------------------------------------------------------
  // State & Hooks
  // ---------------------------------------------------------------------------

  const { open, onOpen, onClose } = useGlobalModal(
    openDecompressVolumeFileModalAtom,
  );

  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string>("");

  const { mutate, isPending } = useDecompress();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * 모달 닫기 처리
   * 압축 해제 진행 중(isPending)일 때는 닫기를 방지합니다.
   */
  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  /**
   * 압축 해제 확인 버튼 클릭 처리
   * API를 호출하고, 성공 시 체크 상태를 초기화합니다.
   */
  const handleOk = () => {
    if (!volumeId || !filePath) return;

    mutate(
      { volumeId, data: { path: filePath } },
      {
        onSuccess: () => {
          setCheckedNodes(new Set());
          toast.success("압축 해제 요청이 전송되었습니다.");
          onClose();
        },
      },
    );
  };

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  useSubscribe<DecompressVolumeFileEventData>(
    VOLUME_EVENTS.sendDecompressVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePath(eventData.filePath);
      onOpen();
    },
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Modal
      type="primary"
      modalWidth={370}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="압축 해제"
      okText="압축 해제"
      showCancelButton
      cancelText="취소"
      centered
      okButtonProps={{ loading: isPending }}
    >
      <div>선택한 파일을 압축 해제하시겠습니까?</div>
    </Modal>
  );
}
