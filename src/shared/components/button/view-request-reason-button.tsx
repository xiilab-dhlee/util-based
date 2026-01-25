"use client";

import { Icon } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRequestReasonButtonProps {
  reason?: string;
  disabled?: boolean;
}

export function ViewRequestReasonButton({
  reason,
  disabled = false,
}: ViewRequestReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    if (disabled) return;
    publish(COMMON_EVENTS.openRequestReasonModal, { reason });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClickIcon}
        disabled={disabled}
      >
        <Icon name="Information" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
