"use client";

import { useAtomValue } from "jotai";

import { useGetAllAccounts } from "@/api/generated/admin-account/admin-account";
import type { AccountSortRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DeleteAccountModal } from "@/domain/account-management/components/delete-account-modal";
import { AccountListBody } from "@/domain/account-management/components/list/account-list-body";
import { AccountListFilter } from "@/domain/account-management/components/list/account-list-filter";
import { AccountListFooter } from "@/domain/account-management/components/list/account-list-footer";
import { UpdateAccountModal } from "@/domain/account-management/components/list/update-account-modal";
import { UpdateAccountStatusModal } from "@/domain/account-management/components/list/update-account-status-modal";
import { ViewAccountDetailModal } from "@/domain/account-management/components/list/view-account-detail-modal";
import { ACCOUNT_SORT_FIELD_MAP } from "@/domain/account-management/constants/account.constant";
import {
  accountPageAtom,
  accountSearchTextAtom,
  accountSortAtom,
} from "@/domain/account-management/state/account.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import { ListPageBody } from "@/styles/layers/list-page-layers.styled";

export function AccountListMain() {
  const page = useAtomValue(accountPageAtom);
  const searchText = useAtomValue(accountSearchTextAtom);
  const sort = useAtomValue(accountSortAtom);

  const sortRequest: AccountSortRequest | null = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: ACCOUNT_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetAllAccounts({
    pageSearchRequest: {
      pageNo: page,
      pageSize: LIST_PAGE_SIZE,
      keyword: searchText,
    },
    ...(sortRequest ? { sortRequest } : {}),
  });

  return (
    <>
      <ListPageBody>
        <AccountListFilter totalSize={data?.totalSize} />
        <AccountListBody
          data={data?.content || []}
          isLoading={isLoading}
          isError={isError}
        />
        <AccountListFooter
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
        />
      </ListPageBody>
      <ViewAccountDetailModal />
      <UpdateAccountModal />
      <UpdateAccountStatusModal />
      <DeleteAccountModal />
    </>
  );
}
