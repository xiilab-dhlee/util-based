"use client";

import { Icon } from "xiilab-ui";

import type { AdminResourceRequestListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewRejectReasonButtonProps {
  resource: AdminResourceRequestListResponse;
}

export function ViewRejectResourceButton({
  resource,
}: ViewRejectReasonButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(WORKSPACE_EVENTS.sendRejectResource, {
      resourceRequestId: resource.resourceRequestId,
      workspaceName: resource.workspaceName,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClickIcon}
        disabled={resource.approvalStatus !== "WAITING"}
      >
        <Icon name="Close" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
