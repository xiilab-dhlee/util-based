"use client";

import { Icon } from "xiilab-ui";

import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface DeleteWorkspaceMemberButtonProps extends WorkspaceMemberListType {}

export function DeleteWorkspaceMemberButton(
  props: DeleteWorkspaceMemberButtonProps,
) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKSPACE_EVENTS.sendDeleteWorkspaceMember, [props.id]);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick}>
        <Icon name="Delete" color="#000" size={16} />
        <span className="sr-only">워크스페이스 멤버 삭제</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
