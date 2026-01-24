"use client";

import styled from "styled-components";

import { IMAGE_JOB_STATUS } from "@/domain/registry/constants/registry-list.constant";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface RegistryJobLogButtonProps {
  imageTagId: number;
  status: string;
}

export function RegistryJobLogButton({
  imageTagId,
  status,
}: RegistryJobLogButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    const isStreaming = status === IMAGE_JOB_STATUS.IN_PROGRESS;
    const eventName = isStreaming
      ? REGISTRY_EVENTS.openStreamLogModal
      : REGISTRY_EVENTS.openLogModal;

    publish(eventName, { imageTagId });
  };

  return (
    <StyledButton type="button" onClick={handleClick}>
      로그 보기
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
