import { Button } from "xiilab-ui";

import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface MonitoringNotificationDeleteButtonProps {
  notificationSetId: number;
}

export function MonitoringNotificationDeleteButton({
  notificationSetId,
}: MonitoringNotificationDeleteButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(MONITORING_EVENTS.sendDeleteNotification, {
      id: notificationSetId,
    });
  };

  return <Button icon="Delete" iconSize={16} onClick={handleClick} />;
}
