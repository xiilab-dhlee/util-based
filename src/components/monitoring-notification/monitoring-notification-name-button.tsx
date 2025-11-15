
import { usePublish } from "@/hooks/common/use-pub-sub";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";

interface MonitoringNotificationNameButtonProps {
  id: string;
  name: string;
}

export function MonitoringNotificationNameButton({
  id,
  name,
}: MonitoringNotificationNameButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(MONITORING_EVENTS.sendNotificationSetting, { id });
  };

  return (
    <span role="button" onClick={handleClick}>
      {name}
    </span>
  );
}

