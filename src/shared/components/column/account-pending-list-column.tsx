import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { AccountPendingAllCheck } from "@/domain/account-management/components/pending/account-pending-all-check";
import { AccountPendingItemCheck } from "@/domain/account-management/components/pending/account-pending-item-check";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "../../../styles/layers/column-layer.styled";

export const accountPendingListColumn: ResponsiveColumnType[] = [
  {
    title: <AccountPendingAllCheck />,
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_, record: AccountListType) => {
      return <AccountPendingItemCheck account={record} />;
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
            <Icon name="Close" color="var(--icon-fill)" />
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
            <Icon name="Check" color="var(--icon-fill)" />
          </ColumnIconWrap>
        </ColumnAlignCenterWrap>
      );
    },
  },
];
