"use client";

import { Icon } from "xiilab-ui";

import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface DeleteWorkloadButtonProps {
  workloadId: string;
  disabled?: boolean;
}

export function DeleteWorkloadButton({
  workloadId,
  disabled,
}: DeleteWorkloadButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKLOAD_EVENTS.sendDeleteWorkload, workloadId);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick} disabled={disabled}>
        <Icon name="Delete" color="var(--icon-fill)" size={20} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
