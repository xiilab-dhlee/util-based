import { Button } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface ResetPasswordButtonProps {
  account: AccountItemResponse;
  isDisabled?: boolean;
}

export function ResetPasswordButton({
  account,
  isDisabled = false,
}: ResetPasswordButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    if (isDisabled) return;
    publish(ACCOUNT_EVENTS.sendResetPassword, account);
  };

  return (
    <Button
      icon="Refresh"
      onClick={handleClick}
      disabled={isDisabled}
      data-testid={ACCOUNT_SELECTOR.RESET_PASSWORD_BUTTON}
    />
  );
}
