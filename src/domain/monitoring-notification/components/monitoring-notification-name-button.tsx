import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ColumnTextButton } from "@/styles/layers/column-layer.styled";

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

  return <ColumnTextButton onClick={handleClick}>{name}</ColumnTextButton>;
}
