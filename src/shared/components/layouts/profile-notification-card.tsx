"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { formatElapsedTime } from "@/shared/utils/date.util";

interface ProfileNotificationCardProps extends NotificationListType {}

export function ProfileNotificationCard({
  content,
  createdDate,
}: ProfileNotificationCardProps) {
  return (
    <Container>
      <IconWrapper>
        <Icon name="NotiFilled" color="#A4C8FF" size={14} />
      </IconWrapper>
      <ItemBody>
        <ItemMessage>{content}</ItemMessage>
        <ItemTime>{formatElapsedTime(createdDate)}</ItemTime>
      </ItemBody>
    </Container>
  );
}

const Container = styled.li`
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const IconWrapper = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(81, 94, 128, 0.7);
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemMessage = styled.a`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(245, 245, 245, 0.9);
  text-decoration: none;

  &.read {
    color: #969a9f;
  }
`;

const ItemTime = styled.time`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #fff;

  &.read {
    color: #969a9f;
  }
`;
