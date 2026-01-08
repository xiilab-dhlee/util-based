"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetAllAccounts } from "@/api/generated/admin-account/admin-account";
import { DeleteAccountModal } from "@/domain/account-management/components/delete-account-modal";
import { AccountListBody } from "@/domain/account-management/components/list/account-list-body";
import { AccountListFilter } from "@/domain/account-management/components/list/account-list-filter";
import { AccountListFooter } from "@/domain/account-management/components/list/account-list-footer";
import { ConfirmResetPasswordModal } from "@/domain/account-management/components/list/confirm-reset-password-modal";
import { ResetPasswordResultModal } from "@/domain/account-management/components/list/reset-password-result-modal";
import { UpdateAccountModal } from "@/domain/account-management/components/list/update-account-modal";
import { UpdateAccountStatusModal } from "@/domain/account-management/components/list/update-account-status-modal";
import { ViewAccountDetailModal } from "@/domain/account-management/components/list/view-account-detail-modal";
import { ACCOUNT_SORT_FIELD_MAP } from "@/domain/account-management/constants/account.constant";
import {
  accountCheckedListAtom,
  accountPageAtom,
  accountSearchTextAtom,
  accountSortAtom,
} from "@/domain/account-management/state/account.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import { ListPageBody } from "@/styles/layers/list-page-layers.styled";

export function AccountListMain() {
  const resetPage = useResetAtom(accountPageAtom);
  const setSearchText = useSetAtom(accountSearchTextAtom);
  const setSort = useSetAtom(accountSortAtom);
  const resetCheckedList = useResetAtom(accountCheckedListAtom);

  const page = useAtomValue(accountPageAtom);
  const searchText = useAtomValue(accountSearchTextAtom);
  const sort = useAtomValue(accountSortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: ACCOUNT_SORT_FIELD_MAP,
  });
  const { data, isLoading, isError } = useGetAllAccounts({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText,
    ...(sortRequest ? { sortRequest } : {}),
  });

  useEffect(() => {
    resetPage();
    setSearchText("");
    setSort({ field: "accountName", order: "ascend" });
    resetCheckedList();
  }, [resetPage, setSearchText, setSort, resetCheckedList]);

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
      <ConfirmResetPasswordModal />
      <ResetPasswordResultModal />
    </>
  );
}
