import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

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
    <button type="button" onClick={handleClick}>
      {name}
    </button>
  );
}
