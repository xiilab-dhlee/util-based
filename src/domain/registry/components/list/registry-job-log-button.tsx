"use client";

import styled from "styled-components";

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
    publish(REGISTRY_EVENTS.openLogModal, {
      imageTagId,
      status,
    });
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
