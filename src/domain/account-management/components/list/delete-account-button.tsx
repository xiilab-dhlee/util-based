import { Button } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface DeleteAccountButtonProps {
  account: AccountItemResponse;
}

export function DeleteAccountButton({ account }: DeleteAccountButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendDeleteAccount, [account.accountId]);
  };

  return (
    <Button
      icon="Delete"
      onClick={handleClick}
      data-testid={ACCOUNT_SELECTOR.DELETE_BUTTON}
    />
  );
}
