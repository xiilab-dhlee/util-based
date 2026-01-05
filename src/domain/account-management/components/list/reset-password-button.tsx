import { Button } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface ResetPasswordButtonProps {
  account: AccountItemResponse;
}

export function ResetPasswordButton({ account }: ResetPasswordButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(ACCOUNT_EVENTS.sendResetPassword, account);
  };

  return <Button icon="Refresh" onClick={handleClick} />;
}
