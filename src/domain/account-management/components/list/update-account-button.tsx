import { Button } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface UpdateAccountButtonProps {
  account: AccountItemResponse;
  isDisabled?: boolean;
}

export function UpdateAccountButton({
  account,
  isDisabled = false,
}: UpdateAccountButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    if (isDisabled) return;
    publish(ACCOUNT_EVENTS.sendUpdateAccount, account.accountId);
  };

  return (
    <Button
      icon="Edit02"
      onClick={handleClick}
      disabled={isDisabled}
      data-testid={ACCOUNT_SELECTOR.UPDATE_BUTTON}
    />
  );
}
