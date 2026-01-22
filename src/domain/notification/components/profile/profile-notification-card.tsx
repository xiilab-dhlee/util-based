"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type {
  AdminNotificationItemResponse,
  NotificationItemResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { formatElapsedTime } from "@/shared/utils/date.util";

type NotificationItem =
  | NotificationItemResponse
  | AdminNotificationItemResponse;

interface ProfileNotificationCardProps<T extends NotificationItem> {
  item: T;
  onClick?: (item: T) => void;
}

export function ProfileNotificationCard<T extends NotificationItem>({
  item,
  onClick,
}: ProfileNotificationCardProps<T>) {
  const { notificationContent, createdAt, isRead } = item;

  const handleClick = () => {
    onClick?.(item);
  };

  return (
    <Container>
      <CardButton type="button" onClick={handleClick} $clickable={!!onClick}>
        <IconWrapper>
          <Icon name="NotiFilled" color="#A4C8FF" size={14} />
        </IconWrapper>
        <ItemBody>
          <ItemMessage $isRead={isRead}>{notificationContent}</ItemMessage>
          <ItemTime $isRead={isRead}>{formatElapsedTime(createdAt)}</ItemTime>
        </ItemBody>
      </CardButton>
    </Container>
  );
}

const Container = styled.li`
  border-bottom: 1px solid #515e804d;
`;

const CardButton = styled.button<{ $clickable?: boolean }>`
  all: unset;
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background-color: ${({ $clickable }) =>
      $clickable ? "rgba(255, 255, 255, 0.05)" : "transparent"};
  }

  &:focus-visible {
    outline: 2px solid #a4c8ff;
    outline-offset: 2px;
  }
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

const ItemMessage = styled.div<{ $isRead?: boolean }>`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${({ $isRead }) => ($isRead ? "#969a9f" : "rgba(245, 245, 245, 0.9)")};
  text-decoration: none;

  /* 여러 줄 텍스트 줄임표 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

`;

const ItemTime = styled.time<{ $isRead?: boolean }>`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: ${({ $isRead }) => ($isRead ? "#969a9f" : "#fff")};
`;
