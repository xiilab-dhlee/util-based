"use client";

import { Icon } from "xiilab-ui";

import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface DeleteWorkloadButtonProps {
  workloadResourceName: string;
  workspaceId: number;
  disabled?: boolean;
}

export function DeleteWorkloadButton({
  workloadResourceName,
  workspaceId,
  disabled,
}: DeleteWorkloadButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKLOAD_EVENTS.openDeleteModal, {
      workloadResourceName,
      workspaceId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClick}
        disabled={disabled}
        data-testid={WORKLOAD_SELECTOR.DELETE_BUTTON}
      >
        <Icon name="Delete" color="var(--icon-fill)" size={20} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
