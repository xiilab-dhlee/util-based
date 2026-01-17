"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** 삭제 모달 이벤트 데이터 */
interface DeleteVolumeFileEventData {
  volumeId: number;
  filePaths: string[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * 볼륨 파일 삭제 모달 컴포넌트
 *
 * 선택한 볼륨 파일을 삭제할 수 있는 모달입니다.
 */
export function DeleteVolumeFileModal() {
  // ---------------------------------------------------------------------------
  // State & Hooks
  // ---------------------------------------------------------------------------

  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteVolumeFileModalAtom,
  );

  const setTreeData = useSetAtom(volumeFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const { mutate, isPending } = useDeleteFiles();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * 모달 닫기 처리
   * 삭제 진행 중(isPending)일 때는 닫기를 방지합니다.
   */
  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  /**
   * 삭제 확인 버튼 클릭 처리
   * 상위 폴더 경로만 추출하여 API를 호출하고, 성공 시 트리 상태를 업데이트합니다.
   */
  const handleOk = () => {
    if (!volumeId || filePaths.length === 0) return;

    // 상위 폴더 경로만 추출 (하위 파일/폴더는 상위 폴더 삭제 시 함께 삭제됨)
    const filteredPaths = filterToRootPaths(filePaths);

    mutate(
      { volumeId, data: { paths: filteredPaths } },
      {
        onSuccess: () => {
          setTreeData((prev) => removeNodesFromTree(prev, filteredPaths));
          setCheckedNodes(new Set());
          onClose();
        },
      },
    );
  };

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  useSubscribe<DeleteVolumeFileEventData>(
    VOLUME_EVENTS.sendDeleteVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
      onOpen();
    },
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
