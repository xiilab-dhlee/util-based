import styled from "styled-components";
import type { ResponsiveColumnType, TagGroupItem } from "xiilab-ui";
import { TagGroup } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AccountStatusSwitch } from "@/domain/account-management/components/list/account-status-switch";
import { DeleteAccountButton } from "@/domain/account-management/components/list/delete-account-button";
import { ResetPasswordButton } from "@/domain/account-management/components/list/reset-password-button";
import { UpdateAccountButton } from "@/domain/account-management/components/list/update-account-button";
import type { AccountSortState } from "@/domain/account-management/constants/account.constant";
import type { AccountRole } from "@/shared/constants/core.constant";
import { ACCOUNT_ROLE_LABEL } from "@/shared/constants/core.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import {
  ColumnAlignCenterWrap,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

const createGroupTagItems = (groupNames: string[]): TagGroupItem[] => {
  return groupNames.map((groupName, index) => ({
    key: `${groupName}-${index}`,
    label: groupName,
    tagProps: {
      variant: "gray" as const,
    },
  }));
};

const createColumnList = (sort: AccountSortState): ResponsiveColumnType[] => {
  return [
    {
      title: "이름",
      key: "accountName",
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
          <ColumnTextButton
            onClick={handleClick}
            data-testid={ACCOUNT_SELECTOR.NAME}
          >
            {accountName}
          </ColumnTextButton>
        );
      },
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
      align: "left",
      width: "20%",
      ellipsis: true,
      render: (email: string) => {
        return <span data-testid={ACCOUNT_SELECTOR.EMAIL}>{email}</span>;
      },
    },
    {
      title: "그룹",
      key: "groupName",
      dataIndex: "groupName",
      align: "left",
      width: "20%",
      render: (groupName: string[]) => {
        if (!groupName || groupName.length === 0) return "-";
        return (
          <ColumnNoWrapOverflow data-testid={ACCOUNT_SELECTOR.GROUP}>
            <TagGroup items={createGroupTagItems(groupName)} maxWidth="100%" />
          </ColumnNoWrapOverflow>
        );
      },
    },
    {
      title: "권한",
      key: "accountRole",
      dataIndex: "accountRole",
      align: "center",
      width: "10%",
      render: (accountRole: AccountRole) => {
        const roleLabel = ACCOUNT_ROLE_LABEL[accountRole] ?? accountRole;
        return <span data-testid={ACCOUNT_SELECTOR.ROLE}>{roleLabel}</span>;
      },
    },
    {
      title: "가입일",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      width: "10%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt: string) => {
        return (
          <span data-testid={ACCOUNT_SELECTOR.CREATED_AT}>
            {formatDateSafely(createdAt)}
          </span>
        );
      },
    },
    {
      title: "상태",
      key: "isEnabled",
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
      key: "update",
      align: "center",
      width: "6%",
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
      key: "resetPassword",
      align: "center",
      width: "6%",
      render: (_, account: AccountItemResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <ResetPasswordButton account={account} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "삭제",
      key: "delete",
      align: "center",
      width: "5%",
      render: (_, account: AccountItemResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <DeleteAccountButton account={account} />
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

const ColumnNoWrapOverflow = styled.div`
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
`;
