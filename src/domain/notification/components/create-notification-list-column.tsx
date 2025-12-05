import type { ResponsiveColumnType } from "xiilab-ui";

import { getNotificationTypeLabel } from "@/domain/notification/constants/notification.constant";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 알림 목록 테이블 컬럼 정의
 *
 * 선택(체크박스) 컬럼은 Ant Design Table의 rowSelection 기능을 사용하여 처리하고,
 * 이 컬럼 정의에서는 도메인 데이터 컬럼만 관리합니다.
 */
export const notificationListColumn: ResponsiveColumnType<NotificationListType>[] =
  [
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
