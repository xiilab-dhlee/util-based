"use client";

import { Icon } from "xiilab-ui";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

type WorkspaceMemberRoleEventPayload = Pick<
  WorkspaceMemberResponse,
  "accountId" | "accountName" | "email" | "memberRole"
>;

interface UpdateWorkspaceMemberRoleButtonProps {
  member: WorkspaceMemberRoleEventPayload;
}

export function UpdateWorkspaceMemberRoleButton({
  member,
}: UpdateWorkspaceMemberRoleButtonProps) {
  const handleClick = () => {
    const payload: WorkspaceMemberRoleEventPayload = {
      accountId: member.accountId,
      accountName: member.accountName,
      email: member.email,
      memberRole: member.memberRole,
    };
    pubsubUtil.publish(SETTING_EVENTS.sendUpdateWorkspaceMemberRole, payload);
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Edit02" color="#000" size={16} />
      <span className="sr-only">권한 수정</span>
    </ColumnIconWrap>
  );
}
