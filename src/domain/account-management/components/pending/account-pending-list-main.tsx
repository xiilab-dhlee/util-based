"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetSignupRequests } from "@/api/generated/admin-account-approval/admin-account-approval";
import { AccountPendingListBody } from "@/domain/account-management/components/pending/account-pending-list-body";
import { AccountPendingListFilter } from "@/domain/account-management/components/pending/account-pending-list-filter";
import { AccountPendingListFooter } from "@/domain/account-management/components/pending/account-pending-list-footer";
import { ApproveAccountPendingModal } from "@/domain/account-management/components/pending/approve-account-pending-modal";
import { RejectAccountPendingModal } from "@/domain/account-management/components/pending/reject-account-pending-modal";
import { SIGNUP_REQUEST_SORT_FIELD_MAP } from "@/domain/account-management/constants/account.constant";
import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
  accountPendingSortAtom,
} from "@/domain/account-management/state/account.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import { ListPageBody } from "@/styles/layers/list-page-layers.styled";

export function AccountPendingListMain() {
  const resetPage = useResetAtom(accountPendingPageAtom);
  const setSearchText = useSetAtom(accountPendingSearchTextAtom);
  const setSort = useSetAtom(accountPendingSortAtom);
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  const page = useAtomValue(accountPendingPageAtom);
  const searchText = useAtomValue(accountPendingSearchTextAtom);
  const sort = useAtomValue(accountPendingSortAtom);
  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: SIGNUP_REQUEST_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetSignupRequests({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText,
    sort: sortRequest?.sort ?? "CREATED_AT",
    order: sortRequest?.order ?? "DESC",
  });

  useEffect(() => {
    resetPage();
    setSearchText("");
    setSort({ field: "createdAt", order: "descend" });
    resetCheckedList();
  }, [resetPage, setSearchText, setSort, resetCheckedList]);

  return (
    <>
      <ListPageBody>
        <AccountPendingListFilter
          totalSize={data?.totalSize}
          data={data?.content || []}
          isLoading={isLoading}
        />
        <AccountPendingListBody
          data={data?.content || []}
          isLoading={isLoading}
          isError={isError}
        />
        <AccountPendingListFooter
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
        />
      </ListPageBody>
      <ApproveAccountPendingModal />
      <RejectAccountPendingModal />
    </>
  );
}
