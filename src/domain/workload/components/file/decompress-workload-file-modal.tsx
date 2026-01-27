"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useWorkloadDecompressFile } from "@/api/generated/workload/workload";
import { workloadFileCheckedNodesAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DecompressWorkloadFilePayload {
  workspaceId: number;
  workloadResourceName: string;
  filePath: string;
  podName?: string | null;
}

export function DecompressWorkloadFileModal() {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(workloadFileCheckedNodesAtom);

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workloadResourceName, setWorkloadResourceName] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [podName, setPodName] = useState<string | null>(null);

  const { mutate, isPending } = useWorkloadDecompressFile();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (!workspaceId || !workloadResourceName || !filePath) return;

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: { path: filePath },
        params: { podName: podName || undefined },
      },
      {
        onSuccess: () => {
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DecompressWorkloadFilePayload>(
    WORKLOAD_EVENTS.openDecompressFileModal,
    (payload) => {
      setWorkspaceId(payload.workspaceId);
      setWorkloadResourceName(payload.workloadResourceName);
      setFilePath(payload.filePath);
      setPodName(payload.podName ?? null);
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
