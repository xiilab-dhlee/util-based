"use client";


import { usePublish } from "@/hooks/common/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import { MyIcon } from "../icons";
import { COMMON_EVENTS } from "@/constants/common/pubsub.constant";

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
        <MyIcon name="Request" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
