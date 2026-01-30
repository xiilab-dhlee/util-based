import { Button } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface DeleteAccountButtonProps {
  account: AccountItemResponse;
  isDisabled?: boolean;
}

export function DeleteAccountButton({
  account,
  isDisabled = false,
}: DeleteAccountButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    if (isDisabled) return;
    publish(ACCOUNT_EVENTS.sendDeleteAccount, account.accountId);
  };

  return (
    <Button
      icon="Delete"
      onClick={handleClick}
      disabled={isDisabled}
      data-testid={ACCOUNT_SELECTOR.DELETE_BUTTON}
    />
  );
}
