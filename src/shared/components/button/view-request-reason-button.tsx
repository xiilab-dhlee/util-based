"use client";

import { Icon } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRequestReasonButtonProps {
  reason: string;
}

export function ViewRequestReasonButton({
  reason,
}: ViewRequestReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(COMMON_EVENTS.sendRequestReason, reason);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon}>
        <Icon name="Request" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
