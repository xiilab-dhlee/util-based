"use client";

import { useAtomValue } from "jotai";

import { workloadFileCheckedNodesInfoAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { DetailContentButton } from "@/styles/layers/detail-page-layers.styled";

interface DeleteWorkloadFileButtonProps {
  workspaceId: number;
  workloadResourceName: string;
  podName?: string | null;
}

export function DeleteWorkloadFileButton({
  workspaceId,
  workloadResourceName,
  podName,
}: DeleteWorkloadFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(workloadFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(WORKLOAD_EVENTS.openDeleteFileModal, {
      workspaceId,
      workloadResourceName,
      filePaths,
      podName,
    });
  };

  return (
    <DetailContentButton
      type="button"
      onClick={handleClick}
      disabled={checkedNodesInfo.length === 0}
    >
      삭제
    </DetailContentButton>
  );
}
