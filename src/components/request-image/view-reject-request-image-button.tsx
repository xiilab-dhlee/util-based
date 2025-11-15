"use client";

import { Icon } from "xiilab-ui";
import { REQUEST_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";


import { usePublish } from "@/hooks/common/use-pub-sub";
import type { RequestImageListType } from "@/schemas/request-image.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import { REQUEST_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";

interface ViewRejectRequestImageButtonProps {
  requestImage: RequestImageListType;
}

export function ViewRejectRequestImageButton({
  requestImage,
}: ViewRejectRequestImageButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(REQUEST_IMAGE_EVENTS.sendRejectImage, requestImage);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClickIcon} disabled={false}>
        <Icon name="Close" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}

