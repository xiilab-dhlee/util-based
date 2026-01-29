"use client";

import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface RestartWorkloadButtonProps {
  workloadResourceName: string;
  workspaceId: number;
  disabled?: boolean;
}

export function RestartWorkloadButton({
  workloadResourceName,
  workspaceId,
  disabled,
}: RestartWorkloadButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKLOAD_EVENTS.openRestartModal, {
      workloadResourceName,
      workspaceId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClick}
        disabled={disabled}
        data-testid={WORKLOAD_SELECTOR.RESTART_BUTTON}
      >
        <RefreshIcon width={20} height={20} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
