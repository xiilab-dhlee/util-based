"use client";

import { Icon } from "xiilab-ui";

import type { AdminResourceRequestListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ViewApprovalResourceButtonProps {
  resource: AdminResourceRequestListResponse;
}

export function ViewApproveResourceButton({
  resource,
}: ViewApprovalResourceButtonProps) {
  const publish = usePublish();

  const handleClickIcon = () => {
    publish(WORKSPACE_EVENTS.sendApproveResource, {
      resourceRequestId: resource.resourceRequestId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        onClick={handleClickIcon}
        disabled={resource.approvalStatus !== "WAITING"}
      >
        <Icon name="Check" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
