"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeleteFilesByMode } from "@/domain/volume/hooks/use-delete-files-by-mode";
import {
  volumeFileCheckedNodesAtom,
  volumeFileTreeDataAtom,
} from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { removeNodesFromTree } from "@/domain/volume/utils/volume.util";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/utils/filetree.util";

interface DeleteVolumeFilePayload {
  volumeId: number;
  filePaths: string[];
}

interface DeleteVolumeFileModalProps {
  mode: VolumeMode;
}

export function DeleteVolumeFileModal({ mode }: DeleteVolumeFileModalProps) {
  const [open, setOpen] = useState(false);
  const setTreeData = useSetAtom(volumeFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const { mutate, isPending } = useDeleteFilesByMode(mode);

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (!volumeId || filePaths.length === 0) return;

    const filteredPaths = filterToRootPaths(filePaths);
    if (filteredPaths.length === 0) {
      toast.info("삭제할 파일이 없습니다.");
      return;
    }

    mutate(
      { volumeId, data: { paths: filteredPaths } },
      {
        onSuccess: () => {
          setTreeData((prev) => removeNodesFromTree(prev, filteredPaths));
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DeleteVolumeFilePayload>(
    VOLUME_EVENTS.openDeleteFileModal,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="파일 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 파일을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 파일은 복구되지 않습니다.</div>
    </Modal>
  );
}
