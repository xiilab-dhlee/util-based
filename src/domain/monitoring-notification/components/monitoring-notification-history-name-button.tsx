import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface MonitoringNotificationHistoryNameButtonProps {
  id: string;
  name: string;
}

export function MonitoringNotificationHistoryNameButton({
  id,
  name,
}: MonitoringNotificationHistoryNameButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(MONITORING_EVENTS.sendNotificationHistory, { id });
  };

  return (
    <button type="button" onClick={handleClick}>
      {name}
    </button>
  );
}
