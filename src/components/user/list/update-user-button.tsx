import { Icon } from "xiilab-ui";

import { USER_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import type { UserListType } from "@/schemas/user.schema";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface UpdateUserButtonProps {
  /** 대상 노드의 이름 */
  user: UserListType;
}

export function UpdateUserButton({ user }: UpdateUserButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(USER_EVENTS.sendUpdateUser, user);
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Edit02" color="var(--icon-fill)" />
    </ColumnIconWrap>
  );
}

