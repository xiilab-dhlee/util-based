import { Icon } from "xiilab-ui";

import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface UpdateAccountButtonProps {
  /** 대상 노드의 이름 */
  account: AccountListType;
}

export function UpdateAccountButton({ account }: UpdateAccountButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendUpdateAccount, account);
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Edit02" color="var(--icon-fill)" />
    </ColumnIconWrap>
  );
}
