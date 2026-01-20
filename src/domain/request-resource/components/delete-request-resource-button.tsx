"use client";

import { Icon } from "xiilab-ui";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface DeleteRequestResourceButtonProps {
  resource: RequestResourceListType;
}

export function DeleteRequestResourceButton({
  resource,
}: DeleteRequestResourceButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(WORKSPACE_EVENTS.sendDeleteResource, resource);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClickIcon}
        disabled={resource.status !== "WAITING"}
      >
        <Icon name="Close" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
