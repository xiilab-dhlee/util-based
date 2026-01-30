"use client";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import type { TableProps } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ACCOUNT_SORT_FIELDS,
  type AccountSortField,
} from "@/domain/account-management/constants/account.constant";
import { accountSortAtom } from "@/domain/account-management/state/account.atom";
import { createAccountColumn } from "@/shared/components/column/create-account-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import {
  checkIsAdmin,
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface AccountListBodyProps {
  data: AccountItemResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function AccountListBody({
  data,
  isLoading,
  isError,
}: AccountListBodyProps) {
  const { data: session } = useSession();
  const [sort, setSort] = useAtom(accountSortAtom);
  const currentAccountId = getSessionAccountId(session);
  const isCurrentAdmin = checkIsAdmin(session);
  const isCurrentSuperAdmin = checkIsSuperAdmin(session);

  const handleChange: TableProps<AccountItemResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      AccountItemResponse,
      AccountSortField
    >(sorter, ACCOUNT_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createAccountColumn(sort, undefined, {
          currentAccountId,
          isCurrentAdmin,
          isCurrentSuperAdmin,
        })}
        data={data}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="accountId"
        activePadding
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
