"use client";

import type { MouseEvent } from "react";
import { Icon } from "xiilab-ui";

import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

export interface RequestUsePayload {
  imageTagId: number;
}

interface RequestUseButtonProps {
  imageTagId: number;
  disabled?: boolean;
}

export function RequestUseButton({
  imageTagId,
  disabled = false,
}: RequestUseButtonProps) {
  const publish = usePublish();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    publish(REGISTRY_EVENTS.openRequestUseModal, { imageTagId });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title="사용 요청 버튼"
      >
        <Icon name="RequestResource" color="var(--icon-fill)" size={16} />
        <span className="sr-only">사용 요청 버튼</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
