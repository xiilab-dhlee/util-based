"use client";

import { Icon } from "xiilab-ui";

import type { ImageTagUsageRequestResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewDecisionReasonButtonProps {
  reason?: string;
  approvalStatus: ImageTagUsageRequestResponseApprovalStatus;
}

export function ViewDecisionReasonButton({
  reason,
  approvalStatus,
}: ViewDecisionReasonButtonProps) {
  const publish = usePublish();
  const isDisabled = approvalStatus === "APPROVAL_WAITING";

  const handleClickIcon = () => {
    if (isDisabled) return;

    if (approvalStatus === "APPROVED") {
      publish(COMMON_EVENTS.openApprovalReasonModal, { reason });
    } else if (approvalStatus === "REJECTED") {
      publish(COMMON_EVENTS.openRejectReasonModal, { reason });
    }
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
