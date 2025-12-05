import type { ResponsiveColumnType } from "xiilab-ui";

import { NotificationAllCheck } from "@/domain/notification/components/list/notification-all-check";
import { NotificationItemCheck } from "@/domain/notification/components/list/notification-item-check";
import { getNotificationTypeLabel } from "@/domain/notification/constants/notification.constant";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

export const notificationListColumn: ResponsiveColumnType[] = [
  {
    title: <NotificationAllCheck />,
    dataIndex: "checkbox",
    align: "center",
    width: CHECKBOX_COLUMN_WIDTH,
    render: (_: unknown, record: NotificationListType) => {
      return <NotificationItemCheck notification={record} />;
    },
  },
  {
    title: "알림 유형",
    dataIndex: "type",
    align: "left",
    render: (_: unknown, record: NotificationListType) => {
      return <span>{getNotificationTypeLabel(record.type) ?? "-"}</span>;
    },
  },
  {
    title: "알림 내용",
    dataIndex: "contentTitle",
    align: "left",
  },
  {
    title: "발생일시",
    dataIndex: "createdDate",
    align: "left",
    width: 180,
    render: (createdDate: NotificationListType["createdDate"]) => {
      return (
        <ColumnAlignCenterWrap>
          {formatDateTimeSafely(createdDate) ?? "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },
];
