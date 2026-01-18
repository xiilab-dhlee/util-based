"use client";

import { useSession } from "next-auth/react";
import { Icon } from "xiilab-ui";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { getSessionAccountId } from "@/shared/utils/auth.util";
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
  const { data: session } = useSession();
  const sessionAccountId = getSessionAccountId(session);
  const isMyself =
    Boolean(sessionAccountId) && String(member.accountId) === sessionAccountId;

  const handleClick = () => {
    if (isMyself) return;
    const payload: WorkspaceMemberRoleEventPayload = {
      accountId: member.accountId,
      accountName: member.accountName,
      email: member.email,
      memberRole: member.memberRole,
    };
    pubsubUtil.publish(SETTING_EVENTS.sendUpdateWorkspaceMemberRole, payload);
  };

  return (
    <ColumnIconWrap onClick={handleClick} disabled={isMyself} type="button">
      <Icon name="Edit02" color="var(--icon-fill)" size={16} />
      <span className="sr-only">권한 수정</span>
    </ColumnIconWrap>
  );
}
