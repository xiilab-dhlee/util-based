import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { UserPendingAllCheck } from "@/components/user/pending/user-pending-all-check";
import { UserPendingItemCheck } from "@/components/user/pending/user-pending-item-check";
import type { UserListType } from "@/schemas/user.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "../../../styles/layers/column-layer.styled";
import { MyIcon } from "../icon";

export const userPendingListColumn: ResponsiveColumnType[] = [
  {
    title: <UserPendingAllCheck />,
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_, record: UserListType) => {
      return <UserPendingItemCheck user={record} />;
    },
  },
  {
    title: "이름",
    dataIndex: "name",
    align: "left",
  },
  {
    title: "이메일",
    dataIndex: "email",
    align: "left",
  },
  {
    title: "가입일",
    dataIndex: "createdAt",
    align: "left",
    render: (createdAt: string) => {
      return <span>{format(createdAt, "yyyy.MM.dd")}</span>;
    },
  },
  {
    title: "반려",
    dataIndex: "id",
    align: "center",
    width: 40,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
            <MyIcon name="Close" color="var(--icon-fill)" />
          </ColumnIconWrap>
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "승인",
    dataIndex: "id",
    align: "center",
    width: 40,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
            <MyIcon name="Check" color="var(--icon-fill)" />
          </ColumnIconWrap>
        </ColumnAlignCenterWrap>
      );
    },
  },
];
