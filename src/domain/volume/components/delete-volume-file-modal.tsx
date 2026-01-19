"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeleteFiles } from "@/api/generated/volume/volume";
import {
  openDeleteVolumeFileModalAtom,
  volumeFileCheckedNodesAtom,
  volumeFileTreeDataAtom,
} from "@/domain/volume/state/volume.atom";
import { removeNodesFromTree } from "@/domain/volume/utils/volume.util";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";

interface DeleteVolumeFileEventData {
  volumeId: number;
  filePaths: string[];
}

export function DeleteVolumeFileModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteVolumeFileModalAtom,
  );
  const setTreeData = useSetAtom(volumeFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const { mutate, isPending } = useDeleteFiles();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleOk = () => {
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
          toast.success("선택한 파일을 삭제하였습니다.");
          onClose();
        },
      },
    );
  };

  useSubscribe<DeleteVolumeFileEventData>(
    VOLUME_EVENTS.sendDeleteVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
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
      title="파일 삭제"
      centered
      okButtonProps={{ loading: isPending }}
    >
      <div>선택한 파일을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 파일은 복구되지 않습니다.</div>
    </Modal>
  );
}
