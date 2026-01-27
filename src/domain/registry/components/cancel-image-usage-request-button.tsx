"use client";

import { Button } from "xiilab-ui";

import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface CancelImageUsageRequestButtonProps {
  usageRequestId: number;
  disabled?: boolean;
}

/**
 * 이미지 태그 사용 요청 취소 버튼
 *
 * 클릭 시 취소 모달을 열어 사용자에게 확인을 요청합니다.
 */
export function CancelImageUsageRequestButton({
  usageRequestId,
  disabled,
}: CancelImageUsageRequestButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(REGISTRY_EVENTS.openCancelUsageRequestModal, usageRequestId);
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
