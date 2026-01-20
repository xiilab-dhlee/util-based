import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getNotificationTypeLabel } from "@/domain/notification/constants/notification.constant";
import type { AntdTableSortOrder } from "@/shared/types/core.model";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

const NotificationText = styled.span<{ $isRead: boolean }>`
  font-weight: ${({ $isRead }) => ($isRead ? 400 : 700)};
`;

/**
 * 알림 목록 테이블 컬럼 정의 생성 함수
 *
 * 읽지 않은 알림은 font-weight 700으로 표시됩니다.
 *
 * @param sortOrder - 정렬 순서 (발생일시 컬럼에 적용)
 * @returns 알림 목록 테이블 컬럼 정의
 */
export function createNotificationListColumn(
  sortOrder: AntdTableSortOrder,
): ResponsiveColumnType<AdminNotificationItemResponse>[] {
  return [
    {
      key: "notificationType",
      title: "알림 유형",
      dataIndex: "notificationType",
      align: "left",
      width: "30%",
      render: (_: unknown, record: AdminNotificationItemResponse) => {
        return (
          <NotificationText $isRead={record.isRead}>
            {getNotificationTypeLabel(record.notificationType)}
          </NotificationText>
        );
      },
    },
    {
      key: "notificationContent",
      title: "알림 내용",
      dataIndex: "notificationContent",
      align: "left",
      ellipsis: true,
      width: "50%",
      render: (
        notificationContent: AdminNotificationItemResponse["notificationContent"],
        record: AdminNotificationItemResponse,
      ) => {
        return (
          <NotificationText $isRead={record.isRead}>
            {notificationContent}
          </NotificationText>
        );
      },
    },
    {
      key: "createDateTime",
      title: "발생일시",
      dataIndex: "createDateTime",
      align: "left",
      width: "20%",
      sorter: true,
      sortOrder,
      render: (
        createDateTime: AdminNotificationItemResponse["createDateTime"],
        record: AdminNotificationItemResponse,
      ) => {
        return (
          <NotificationText $isRead={record.isRead}>
            {formatDateTimeSafely(createDateTime)}
          </NotificationText>
        );
      },
    },
  ];
}
