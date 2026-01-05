"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AccountSortField } from "@/domain/account-management/constants/account.constant";
import {
  accountCheckedListAtom,
  accountSortAtom,
} from "@/domain/account-management/state/account.atom";
import { createAccountColumn } from "@/shared/components/column/create-account-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
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
  const [checkedList, setCheckedList] = useAtom(accountCheckedListAtom);
  const [sort, setSort] = useAtom(accountSortAtom);
  const { rowSelection } = useTableSelection<AccountItemResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<AccountItemResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field as AccountSortField,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createAccountColumn(sort)}
        data={data}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="accountId"
        rowSelection={rowSelection}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
