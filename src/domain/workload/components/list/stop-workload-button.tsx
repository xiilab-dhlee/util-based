"use client";

import { Icon } from "xiilab-ui";

import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface StopWorkloadButtonProps {
  workspaceId: number;
  workloadResourceName: string;
  disabled?: boolean;
}

export function StopWorkloadButton({
  workloadResourceName,
  workspaceId,
  disabled,
}: StopWorkloadButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKLOAD_EVENTS.openStopModal, {
      workloadResourceName,
      workspaceId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClick}
        disabled={disabled}
        data-testid={WORKLOAD_SELECTOR.STOP_BUTTON}
      >
        <Icon name="PowerBold" color="var(--icon-fill)" size={20} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
