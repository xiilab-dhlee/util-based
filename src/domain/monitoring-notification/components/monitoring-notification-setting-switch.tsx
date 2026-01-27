import { Switch } from "xiilab-ui";

import { useToggleNotificationEnabledAction } from "@/domain/monitoring-notification/hooks/monitoring-notification-action";

interface MonitoringNotificationSettingSwitchProps {
  notificationSetId: number;
  isEnabled: boolean;
}

export function MonitoringNotificationSettingSwitch({
  notificationSetId,
  isEnabled,
}: MonitoringNotificationSettingSwitchProps) {
  const { mutate, isPending } = useToggleNotificationEnabledAction();

  const handleChange = (checked: boolean) => {
    mutate({
      notificationSetId,
      data: { hasEnabled: checked },
    });
  };

  return (
    <Switch checked={isEnabled} onChange={handleChange} disabled={isPending} />
  );
}
