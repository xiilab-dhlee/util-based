"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useDecompress } from "@/api/generated/volume/volume";
import { volumeFileCheckedNodesAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface Payload {
  volumeId: number;
  filePath: string;
}

export function DecompressVolumeFileModal() {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string | null>("");

  const { mutate, isPending } = useDecompress();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
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

  useSubscribe<Payload>(VOLUME_EVENTS.openDecompressFileModal, (eventData) => {
    setVolumeId(eventData.volumeId);
    setFilePath(eventData.filePath);
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      modalWidth={370}
      open={open}
      onCancel={handleClose}
      icon={<Icon name="Compress" color="#fff" size={18} />}
      onOk={handleOk}
      title="압축 해제"
      okText="압축 해제"
      showCancelButton
      cancelText="취소"
      centered
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 파일을 압축 해제하시겠습니까?</div>
    </Modal>
  );
}
