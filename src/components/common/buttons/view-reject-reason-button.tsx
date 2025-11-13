"use client";

import pubsubConstants from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import { MyIcon } from "../icons";

interface ViewRejectReasonButtonProps {
  reason: string;
}

export function ViewRejectReasonButton({
  reason,
}: ViewRejectReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(pubsubConstants.common.sendRejectReason, reason);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon} disabled={false}>
        <MyIcon name="Request" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
