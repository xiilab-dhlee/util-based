import { Icon } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface UpdateAccountButtonProps {
  account: AccountItemResponse;
}

export function UpdateAccountButton({ account }: UpdateAccountButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendUpdateAccount, account.accountId);
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Edit02" color="var(--icon-fill)" />
    </ColumnIconWrap>
  );
}
