"use client";

import { Button } from "xiilab-ui";

import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SettingRequestResourceCancelButtonProps {
  resourceRequestId: number;
  disabled?: boolean;
}

export function SettingRequestResourceCancelButton({
  resourceRequestId,
  disabled,
}: SettingRequestResourceCancelButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(SETTING_EVENTS.sendCancelResourceRequest, resourceRequestId);
  };

  return (
    <Button
      icon="Close"
      aria-label="요청 취소"
      disabled={disabled}
      onClick={handleClick}
    />
  );
}
