"use client";

import { format } from "date-fns";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { notificationSelectedAtom } from "@/domain/notification/state/notification.atom";

interface NotificationCardProps extends NotificationListType {
  isSelected: boolean;
}

/**
 * 알림 카드 컴포넌트의 실제 구현부
 *
 * 알림 정보를 카드 형태로 표시하며, 클릭 시 상세 페이지로 이동합니다.
 * 알림 타입과 우선순위 정보를 포함한 알림의 주요 정보를 시각적으로 표시합니다.
 */
export function NotificationCard({
  id,
  title,
  type,
  createdDate,
  creatorName,
  isRead,
  priority,
  isSelected,
}: NotificationCardProps) {
  const setSelectedNotification = useSetAtom(notificationSelectedAtom);

  // 카드 클릭 핸들러 - 선택 알림 상태 변경
  const handleClickCard = () => {
    setSelectedNotification(id);
  };

  // 알림 타입에 따른 아이콘 반환
  const getNotificationIcon = () => {
    let icon = "";
    if (type === "INFO") {
      icon = "Information";
    } else if (type === "WARNING") {
      icon = "Warning";
    } else if (type === "ERROR") {
      icon = "Error";
    } else if (type === "SUCCESS") {
      icon = "Success";
    }
    return <Icon name={icon} />;
  };

  return (
    <Card
      contentVariant="default"
      height={156}
      onClick={handleClickCard}
      title={title}
      icon={getNotificationIcon()}
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
    >
      <Container>
        {/* 카드 본문: 알림 정보 표시 */}
        <Body>
          {/* 왼쪽: 정보 라벨 */}
          <CardLeft>
            <CardKey>생성자</CardKey>
            <CardKey>생성일</CardKey>
            <CardKey>우선순위</CardKey>
            <CardKey>읽음</CardKey>
          </CardLeft>
          {/* 오른쪽: 정보 값 */}
          <CardRight>
            <CardValue>{creatorName}</CardValue>
            <CardValue>{format(createdDate, "yyyy-MM-dd")}</CardValue>
            <CardValue>
              <PriorityLabel className={priority.toLowerCase()}>
                {priority === "LOW"
                  ? "낮음"
                  : priority === "MEDIUM"
                    ? "중간"
                    : "높음"}
              </PriorityLabel>
            </CardValue>
            <CardValue>{isRead ? "읽음" : "읽지 않음"}</CardValue>
          </CardRight>
        </Body>
      </Container>
    </Card>
  );
}

// ===== Styled Components =====

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

const CardLeft = styled.div`
  width: 60px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardKey = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #484848;
  word-spacing: 0.1px;
`;

const CardRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 10px;
`;

const CardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
`;

const PriorityLabel = styled.span`
  font-weight: 600;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;

  &.low {
    background-color: #e6f7e6;
    color: #00911d;
  }

  &.medium {
    background-color: #fff3e0;
    color: #ffa052;
  }

  &.high {
    background-color: #fde8e8;
    color: #e85a5a;
  }
`;
