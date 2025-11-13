import pubsubConstants from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";

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
    publish(pubsubConstants.monitoring.sendNotificationSetting, { id });
  };

  return (
    <span role="button" onClick={handleClick}>
      {name}
    </span>
  );
}

