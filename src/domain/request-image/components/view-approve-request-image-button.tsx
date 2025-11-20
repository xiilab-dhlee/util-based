"use client";

import { Icon } from "xiilab-ui";

import type { RequestImageListType } from "@/domain/request-image/schemas/request-image.schema";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewApprovalRequestImageButtonProps {
  requestImage: RequestImageListType;
}

export function ViewApproveRequestImageButton({
  requestImage,
}: ViewApprovalRequestImageButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(REQUEST_IMAGE_EVENTS.sendApproveImage, requestImage);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon} disabled={false}>
        <Icon name="Check" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
