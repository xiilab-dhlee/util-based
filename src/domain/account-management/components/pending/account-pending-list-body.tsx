"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { SignupRequestItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  SIGNUP_REQUEST_SORT_FIELDS,
  type SignupRequestSortField,
} from "@/domain/account-management/constants/account.constant";
import {
  accountPendingCheckedListAtom,
  accountPendingSortAtom,
} from "@/domain/account-management/state/account.atom";
import { createAccountPendingColumn } from "@/shared/components/column/create-account-pending-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface AccountPendingListBodyProps {
  data: SignupRequestItemResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function AccountPendingListBody({
  data,
  isLoading,
  isError,
}: AccountPendingListBodyProps) {
  const [checkedList, setCheckedList] = useAtom(accountPendingCheckedListAtom);
  const [sort, setSort] = useAtom(accountPendingSortAtom);
  const { rowSelection } = useTableSelection<SignupRequestItemResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<SignupRequestItemResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      SignupRequestItemResponse,
      SignupRequestSortField
    >(sorter, SIGNUP_REQUEST_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createAccountPendingColumn(sort)}
        data={data}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
        rowKey="accountId"
        rowSelection={rowSelection}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
