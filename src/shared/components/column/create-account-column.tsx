import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AccountStatusSwitch } from "@/domain/account-management/components/list/account-status-switch";
import { UpdateAccountButton } from "@/domain/account-management/components/list/update-account-button";
import type { AccountSortState } from "@/domain/account-management/constants/account.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (sort: AccountSortState): ResponsiveColumnType[] => {
  return [
    {
      title: "이름",
      dataIndex: "accountName",
      align: "left",
      width: "15%",
      ellipsis: true,
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "accountName"),
      render: (accountName: string, record: AccountItemResponse) => {
        const handleClick = () => {
          pubsubUtil.publish(
            ACCOUNT_EVENTS.sendViewAccountDetail,
            record.accountId,
          );
        };
        return (
          <ColumnTextButton onClick={handleClick}>
            {accountName}
          </ColumnTextButton>
        );
      },
    },
    {
      title: "이메일",
      dataIndex: "email",
      align: "left",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "그룹",
      dataIndex: "groupName",
      align: "left",
      width: "25%",
      ellipsis: true,
      render: (groupName: string[]) => {
        if (!groupName || groupName.length === 0) return "-";
        return groupName.join(", ");
      },
    },
    {
      title: "권한",
      dataIndex: "accountRole",
      align: "center",
      width: "10%",
    },
    {
      title: "가입일",
      dataIndex: "createdAt",
      align: "left",
      width: "12%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt: string) => {
        return <span>{formatDateSafely(createdAt)}</span>;
      },
    },
    {
      title: "상태",
      dataIndex: "isEnabled",
      align: "center",
      width: "8%",
      render: (_, record: AccountItemResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <AccountStatusSwitch account={record} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "수정",
      dataIndex: "update",
      align: "center",
      width: "5%",
      render: (_, account: AccountItemResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <UpdateAccountButton account={account} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "PW 초기화",
      dataIndex: "resetPassword",
      align: "center",
      width: "5%",
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
              <Icon name="Notice" color="var(--icon-fill)" />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

export const createAccountColumn = (
  sort: AccountSortState,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(sort);

  return applyColumnConfigs(columnList, config);
};
