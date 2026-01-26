"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useDecompressFileByMode } from "@/domain/volume/hooks/use-decompress-file-by-mode";
import { volumeFileCheckedNodesAtom } from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DecompressVolumeFilePayload {
  volumeId: number;
  filePath: string;
}

interface DecompressVolumeFileModalProps {
  mode: VolumeMode;
}

export function DecompressVolumeFileModal({
  mode,
}: DecompressVolumeFileModalProps) {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  const { mutate, isPending } = useDecompressFileByMode(mode);

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (!volumeId || !filePath) return;

    mutate(
      { volumeId, data: { path: filePath } },
      {
        onSuccess: () => {
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DecompressVolumeFilePayload>(
    VOLUME_EVENTS.openDecompressFileModal,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePath(eventData.filePath);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      modalWidth={370}
      open={open}
      onCancel={handleCancel}
      icon={<Icon name="Compress" color="#fff" size={18} />}
      onOk={handleOk}
      title="압축 해제"
      okText="압축 해제"
      showCancelButton
      cancelText="취소"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 파일을 압축 해제하시겠습니까?</div>
    </Modal>
  );
}
