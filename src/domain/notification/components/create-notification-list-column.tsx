import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { NotificationAllCheck } from "@/domain/notification/components/list/notification-all-check";
import { NotificationItemCheck } from "@/domain/notification/components/list/notification-item-check";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
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
    render: () => {
      return <span>워크스페이스 생성</span>;
    },
  },
  {
    title: "알림 내용",
    dataIndex: "content",
    align: "left",
  },
  {
    title: "발생일시",
    dataIndex: "createdDate",
    align: "center",
    width: 180,
    render: (createdDate: string) => {
      return (
        <ColumnAlignCenterWrap>
          {format(createdDate, "yyyy-MM-dd HH:mm:ss")}
        </ColumnAlignCenterWrap>
      );
    },
  },
];
