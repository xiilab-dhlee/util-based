"use client";

import { Icon } from "xiilab-ui";

import { WORKSPACE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import type { RequestResourceListType } from "@/schemas/request-resource.schema";
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
