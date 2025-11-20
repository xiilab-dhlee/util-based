import { Icon } from "xiilab-ui";

import type { UserListType } from "@/domain/user/schemas/user.schema";
import { USER_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
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
