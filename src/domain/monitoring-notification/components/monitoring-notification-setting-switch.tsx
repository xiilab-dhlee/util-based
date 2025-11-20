import { useState } from "react";
import { Switch } from "xiilab-ui";

export function MonitoringNotificationSettingSwitch() {
  const [checked, setChecked] = useState(true);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
  };

  return <Switch checked={checked} onChange={handleChange} />;
}
