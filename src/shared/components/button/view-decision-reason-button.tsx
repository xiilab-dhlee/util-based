"use client";

import { Icon } from "xiilab-ui";

import type { ImageTagUsageRequestResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewDecisionReasonButtonProps {
  usageRequestId: number;
  decisionReason?: string;
  approvalStatus: ImageTagUsageRequestResponseApprovalStatus;
  deciderName?: string;
  deciderId?: string;
  decidedAt?: string;
}

export function ViewDecisionReasonButton({
  usageRequestId,
  decisionReason,
  approvalStatus,
  deciderName,
  deciderId,
  decidedAt,
}: ViewDecisionReasonButtonProps) {
  const publish = usePublish();
  const isDisabled = approvalStatus === "APPROVAL_WAITING";

  const handleClickIcon = () => {
    if (isDisabled) return;

    publish(REQUEST_IMAGE_EVENTS.openViewAndEditDecisionReasonModal, {
      usageRequestId,
      decisionReason,
      approvalStatus,
      deciderName,
      deciderId,
      decidedAt,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClickIcon}
        disabled={isDisabled}
      >
        <Icon name="Information" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
