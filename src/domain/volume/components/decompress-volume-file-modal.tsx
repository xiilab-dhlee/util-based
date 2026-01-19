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

interface DecompressVolumeFileEventData {
  volumeId: number;
  filePath: string;
}

export function DecompressVolumeFileModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDecompressVolumeFileModalAtom,
  );
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string>("");

  const { mutate, isPending } = useDecompress();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

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

  useSubscribe<DecompressVolumeFileEventData>(
    VOLUME_EVENTS.sendDecompressVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePath(eventData.filePath);
      onOpen();
    },
  );

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
