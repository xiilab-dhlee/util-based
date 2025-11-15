"use client";

import { Icon } from "xiilab-ui";

import { WORKSPACE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import type { WorkspaceMemberListType } from "@/schemas/workspace-member.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface UpdateWorkspaceMemberButtonProps extends WorkspaceMemberListType {}

export function UpdateWorkspaceMemberButton(props: UpdateWorkspaceMemberButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(WORKSPACE_EVENTS.sendUpdateWorkspaceMember, props);
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap onClick={handleClick}>
        <Icon name="Edit02" color="#000" size={16} />
        <span className="sr-only">계정 정보 수정</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}

