"use client";

import { Icon } from "xiilab-ui";

import type { ImageTagUsageRequestResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRejectRequestImageButtonProps {
  requestImage: ImageTagUsageRequestResponse;
}

export function ViewRejectRequestImageButton({
  requestImage,
}: ViewRejectRequestImageButtonProps) {
  const publish = usePublish();
  const isDisabled = requestImage.approvalStatus !== "APPROVAL_WAITING";

  const handleClickIcon = () => {
    if (isDisabled) return;

    publish(REQUEST_IMAGE_EVENTS.openRejectModal, {
      usageRequestId: requestImage.usageRequestId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon} disabled={isDisabled}>
        <Icon name="Close" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
