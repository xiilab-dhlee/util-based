"use client";

import { Icon } from "xiilab-ui";

import type { ImageTagUsageRequestResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewApprovalRequestImageButtonProps {
  requestImage: ImageTagUsageRequestResponse;
}

export function ViewApproveRequestImageButton({
  requestImage,
}: ViewApprovalRequestImageButtonProps) {
  const publish = usePublish();
  const isDisabled = requestImage.approvalStatus !== "APPROVAL_WAITING";

  const handleClickIcon = () => {
    if (isDisabled) return;

    publish(REQUEST_IMAGE_EVENTS.openApproveModal, {
      usageRequestId: requestImage.usageRequestId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClickIcon}
        disabled={isDisabled}
      >
        <Icon name="Check" color="var(--icon-fill)" size={16} />
        <span className="sr-only">이미지 사용 요청 승인 버튼</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
