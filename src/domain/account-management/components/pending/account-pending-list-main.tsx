"use client";

import { useAtomValue } from "jotai";

import { useGetSignupRequests } from "@/api/generated/admin-account/admin-account";
import type { SignupRequestSortRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AccountPendingListBody } from "@/domain/account-management/components/pending/account-pending-list-body";
import { AccountPendingListFilter } from "@/domain/account-management/components/pending/account-pending-list-filter";
import { AccountPendingListFooter } from "@/domain/account-management/components/pending/account-pending-list-footer";
import { ApproveAccountPendingModal } from "@/domain/account-management/components/pending/approve-account-pending-modal";
import { RejectAccountPendingModal } from "@/domain/account-management/components/pending/reject-account-pending-modal";
import { SIGNUP_REQUEST_SORT_FIELD_MAP } from "@/domain/account-management/constants/account.constant";
import {
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
  accountPendingSortAtom,
} from "@/domain/account-management/state/account.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import { ListPageBody } from "@/styles/layers/list-page-layers.styled";

export function AccountPendingListMain() {
  const page = useAtomValue(accountPendingPageAtom);
  const searchText = useAtomValue(accountPendingSearchTextAtom);
  const sort = useAtomValue(accountPendingSortAtom);

  const sortRequest: SignupRequestSortRequest | null = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: SIGNUP_REQUEST_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetSignupRequests({
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
