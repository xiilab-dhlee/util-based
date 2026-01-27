"use client";

import { useAtomValue } from "jotai";

import { workloadFileCheckedNodesInfoAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { DetailContentButton } from "@/styles/layers/detail-page-layers.styled";

interface UnzipWorkloadFileButtonProps {
  workspaceId: number;
  workloadResourceName: string;
  podName?: string | null;
}

export function UnzipWorkloadFileButton({
  workspaceId,
  workloadResourceName,
  podName,
}: UnzipWorkloadFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(workloadFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const selectedNode = checkedNodesInfo[0];
    if (!selectedNode) return;

    publish(WORKLOAD_EVENTS.openDecompressFileModal, {
      workspaceId,
      workloadResourceName,
      filePath: selectedNode.path,
      podName,
    });
  };

  const isDisabled = checkedNodesInfo.length === 0;

  return (
    <DetailContentButton
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
    >
      압축 해제
    </DetailContentButton>
  );
}
