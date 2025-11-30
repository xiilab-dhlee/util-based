import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { AccountPendingAllCheck } from "@/domain/account-management/components/pending/account-pending-all-check";
import { AccountPendingItemCheck } from "@/domain/account-management/components/pending/account-pending-item-check";
import { ApproveAccountPendingButton } from "@/domain/account-management/components/pending/approve-account-pending-button";
import { RejectAccountPendingButton } from "@/domain/account-management/components/pending/reject-account-pending-button";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";

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
    render: (_, record: AccountListType) => {
      return <RejectAccountPendingButton account={record} />;
    },
  },
  {
    title: "승인",
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_, record: AccountListType) => {
      return <ApproveAccountPendingButton account={record} />;
    },
  },
];
