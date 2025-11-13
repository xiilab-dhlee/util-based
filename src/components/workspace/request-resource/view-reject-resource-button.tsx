"use client";

import { Icon } from "xiilab-ui";

import pubsubConstants from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import type { WorkspaceRequestResourceListType } from "@/schemas/workspace-request-resource.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRejectReasonButtonProps {
  resource: WorkspaceRequestResourceListType;
}

export function ViewRejectResourceButton({ resource }: ViewRejectReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(pubsubConstants.workspace.sendRejectResource, resource);
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

