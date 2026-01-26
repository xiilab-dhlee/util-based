"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

export function SecurityLevelSettingButton() {
  const publish = usePublish();

  const handleOpen = () => {
    publish(REGISTRY_EVENTS.openSecurityLevelSettingModal);
  };

  return (
    <Button type="button" onClick={handleOpen}>
      <Icon name="Setting02" color="#fff" />
      <span className="sr-only">보안 레벨 설정</span>
    </Button>
  );
}

const Button = styled.button`
  background-color: #171b26;
  border: 1px solid #515e80;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;
