"use client";

import { useSession } from "next-auth/react";
import { Icon } from "xiilab-ui";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface DeleteWorkspaceMemberButtonProps {
  accountId: WorkspaceMemberResponse["accountId"];
}

export function DeleteWorkspaceMemberButton({
  accountId,
}: DeleteWorkspaceMemberButtonProps) {
  const { data: session } = useSession();
  const sessionAccountId = session?.user?.id ?? "";
  const isMyself =
    Boolean(sessionAccountId) && String(accountId) === sessionAccountId;

  const handleClick = () => {
    if (isMyself) return;
    pubsubUtil.publish(SETTING_EVENTS.sendDeleteWorkspaceMember, [accountId]);
  };

  return (
    <ColumnIconWrap onClick={handleClick} disabled={isMyself} type="button">
      <Icon name="Delete" color="var(--icon-fill)" size={16} />
      <span className="sr-only">워크스페이스 구성원 삭제</span>
    </ColumnIconWrap>
  );
}
