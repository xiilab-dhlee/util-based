"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import type { TableProps } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ACCOUNT_SORT_FIELDS,
  type AccountSortField,
} from "@/domain/account-management/constants/account.constant";
import {
  accountCheckedListAtom,
  accountSortAtom,
} from "@/domain/account-management/state/account.atom";
import { createAccountColumn } from "@/shared/components/column/create-account-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ACCOUNT_ROLES } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
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
  const sessionAccountId = getSessionAccountId(session);
  const isAdmin = checkIsAdmin(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const [checkedList, setCheckedList] = useAtom(accountCheckedListAtom);
  const resetCheckedList = useResetAtom(accountCheckedListAtom);
  const [sort, setSort] = useAtom(accountSortAtom);
  const { rowSelection } = useTableSelection<AccountItemResponse>(
    checkedList,
    setCheckedList,
  );
  const rowSelectionWithDisabled: TableProps<AccountItemResponse>["rowSelection"] =
    {
      ...rowSelection,
      getCheckboxProps: (record: AccountItemResponse) => ({
        disabled:
          (sessionAccountId && record.accountId === sessionAccountId) ||
          (isAdmin && record.accountRole === ACCOUNT_ROLES.SUPER_ADMIN),
      }),
    };

  // biome-ignore lint/correctness/useExhaustiveDependencies: 권한 변화 시 체크 상태 초기화
  useEffect(() => {
    resetCheckedList();
  }, [isAdmin, isSuperAdmin, resetCheckedList]);

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
        columns={createAccountColumn(sort)}
        data={data}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="accountId"
        rowSelection={rowSelectionWithDisabled}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
