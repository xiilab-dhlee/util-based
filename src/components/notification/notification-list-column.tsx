import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { ColumnAlignCenterWrap } from "../../styles/layers/column-layer.styled";

export const notificationListColumn: ResponsiveColumnType[] = [
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
