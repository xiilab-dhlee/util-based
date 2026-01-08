"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
} from "@/domain/account-management/state/account.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface AccountPendingListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function AccountPendingListFooter({
  totalSize,
  isLoading,
}: AccountPendingListFooterProps) {
  const [page, setPage] = useAtom(accountPendingPageAtom);
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={SELECTOR.LIST_PAGINATION}
    />
  );
}
