"use client";

import { Button } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SettingRequestResourceRequestReasonButtonProps {
  reason: string;
}

export function SettingRequestResourceRequestReasonButton({
  reason,
}: SettingRequestResourceRequestReasonButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(COMMON_EVENTS.openRequestReasonModal, { reason });
  };

  return (
    <Button icon="Information" aria-label="요청 사유" onClick={handleClick} />
  );
}
