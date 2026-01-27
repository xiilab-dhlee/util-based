"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useWorkloadDeleteFiles } from "@/api/generated/workload/workload";
import {
  workloadFileCheckedNodesAtom,
  workloadFileTreeDataAtom,
} from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";
import { removeNodesFromTree } from "@/shared/utils/filetree.util";

interface DeleteWorkloadFilePayload {
  workspaceId: number;
  workloadResourceName: string;
  filePaths: string[];
  podName?: string | null;
}

export function DeleteWorkloadFileModal() {
  const [open, setOpen] = useState(false);
  const setTreeData = useSetAtom(workloadFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(workloadFileCheckedNodesAtom);

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workloadResourceName, setWorkloadResourceName] = useState("");
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [podName, setPodName] = useState<string | null>(null);

  const { mutate, isPending } = useWorkloadDeleteFiles();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (!workspaceId || !workloadResourceName || filePaths.length === 0) return;

    const filteredPaths = filterToRootPaths(filePaths);
    if (filteredPaths.length === 0) {
      toast.info("삭제할 파일이 없습니다.");
      return;
    }

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: { path: filteredPaths },
        params: { podName: podName || undefined },
      },
      {
        onSuccess: () => {
          setTreeData((prev) => removeNodesFromTree(prev, filteredPaths));
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DeleteWorkloadFilePayload>(
    WORKLOAD_EVENTS.openDeleteFileModal,
    (payload) => {
      setWorkspaceId(payload.workspaceId);
      setWorkloadResourceName(payload.workloadResourceName);
      setFilePaths(payload.filePaths);
      setPodName(payload.podName ?? null);
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
