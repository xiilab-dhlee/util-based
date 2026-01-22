"use client";

import styled from "styled-components";

import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface RegistryJobStopButtonProps {
  imageTagId: number;
}

export function RegistryJobStopButton({
  imageTagId,
}: RegistryJobStopButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(REGISTRY_EVENTS.openStopJobModal, imageTagId);
  };

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      data-testid={REGISTRY_SELECTOR.JOB_LIST_STOP_BUTTON}
    >
      종료
    </StyledButton>
  );
}

// 드롭다운 메뉴 아이템용 스타일된 버튼 컴포넌트
const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
