import { Switch } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface AccountStatusSwitchProps {
  account: AccountItemResponse;
  isDisabled?: boolean;
}

export function AccountStatusSwitch({
  account,
  isDisabled = false,
}: AccountStatusSwitchProps) {
  const publish = usePublish();

  const handleChange = () => {
    if (isDisabled) return;
    publish(ACCOUNT_EVENTS.sendUpdateAccountStatus, {
      accountId: account.accountId,
      accountName: account.accountName,
      currentStatus: account.isEnabled,
    });
  };

  return (
    <Switch
      checked={account.isEnabled}
      onChange={handleChange}
      disabled={isDisabled}
      data-testid={ACCOUNT_SELECTOR.STATUS}
    />
  );
}
