import type { ResponsiveColumnType } from "xiilab-ui";

import type { SignupRequestItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ApproveAccountPendingButton } from "@/domain/account-management/components/pending/approve-account-pending-button";
import { RejectAccountPendingButton } from "@/domain/account-management/components/pending/reject-account-pending-button";
import type { SignupRequestSortState } from "@/domain/account-management/constants/account.constant";
import { formatDateSafely } from "@/shared/utils/date.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";

export const createAccountPendingListColumn = (
  sort: SignupRequestSortState,
): ResponsiveColumnType[] => {
  return [
    {
      title: "이름",
      dataIndex: "accountName",
      align: "left",
      width: "30%",
      ellipsis: true,
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "accountName"),
    },
    {
      title: "이메일",
      dataIndex: "email",
      align: "left",
      width: "35%",
      ellipsis: true,
    },
    {
      title: "가입일",
      dataIndex: "createdAt",
      align: "left",
      width: "25%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt: string) => {
        return <span>{formatDateSafely(createdAt)}</span>;
      },
    },
    {
      title: "반려",
      dataIndex: "id",
      align: "center",
      width: "5%",
      render: (_, record: SignupRequestItemResponse) => {
        return <RejectAccountPendingButton account={record} />;
      },
    },
    {
      title: "승인",
      dataIndex: "id",
      align: "center",
      width: "5%",
      render: (_, record: SignupRequestItemResponse) => {
        return <ApproveAccountPendingButton account={record} />;
      },
    },
  ];
};
