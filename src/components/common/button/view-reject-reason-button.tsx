"use client";

import { Icon } from "xiilab-ui";

import { COMMON_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRejectReasonButtonProps {
  reason: string;
}

export function ViewRejectReasonButton({
  reason,
}: ViewRejectReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(COMMON_EVENTS.sendRejectReason, reason);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon} disabled={false}>
        <Icon name="Request" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
