"use client";

import { useAtomValue } from "jotai";

import { workloadFileCheckedNodesInfoAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { DetailContentButton } from "@/styles/layers/detail-page-layers.styled";

interface DownloadWorkloadFileButtonProps {
  workspaceId: number;
  workloadResourceName: string;
  podName?: string | null;
}

export function DownloadWorkloadFileButton({
  workspaceId,
  workloadResourceName,
  podName,
}: DownloadWorkloadFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(workloadFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(WORKLOAD_EVENTS.openDownloadFileModal, {
      workspaceId,
      workloadResourceName,
      filePaths,
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
      다운로드
    </DetailContentButton>
  );
}
