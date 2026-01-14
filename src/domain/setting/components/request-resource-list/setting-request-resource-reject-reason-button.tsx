"use client";

import { Button } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SettingRequestResourceRejectReasonButtonProps {
  reason: string;
  disabled?: boolean;
}

export function SettingRequestResourceRejectReasonButton({
  reason,
  disabled = false,
}: SettingRequestResourceRejectReasonButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(COMMON_EVENTS.sendRejectReason, reason);
  };

  return (
    <Button
      icon="Info"
      aria-label="반려 사유"
      onClick={handleClick}
      disabled={disabled}
    />
  );
}
