import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getNotificationTypeLabel } from "@/shared/constants/notification";
import type { AntdTableSortOrder } from "@/shared/types/core.model";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

const NotificationText = styled.span<{ $isRead: boolean }>`
  font-weight: ${({ $isRead }) => ($isRead ? 400 : 700)};
`;

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
      key: "createdAt",
      title: "발생일시",
      dataIndex: "createdAt",
      align: "left",
      width: "20%",
      sorter: true,
      sortOrder,
      render: (
        createdAt: AdminNotificationItemResponse["createdAt"],
        record: AdminNotificationItemResponse,
      ) => {
        return (
          <NotificationText $isRead={record.isRead}>
            {formatDateTimeSafely(createdAt)}
          </NotificationText>
        );
      },
    },
  ];
}
