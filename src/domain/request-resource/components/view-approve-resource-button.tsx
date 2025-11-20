"use client";

import { Icon } from "xiilab-ui";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewApprovalResourceButtonProps {
  resource: RequestResourceListType;
}

export function ViewApproveResourceButton({
  resource,
}: ViewApprovalResourceButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(WORKSPACE_EVENTS.sendApproveResource, resource);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClickIcon}
        disabled={resource.status !== "WAITING"}
      >
        <Icon name="Check" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
