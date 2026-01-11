"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  accountCheckedListAtom,
  accountPageAtom,
} from "@/domain/account-management/state/account.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface AccountListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function AccountListFooter({
  totalSize,
  isLoading,
}: AccountListFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(accountPageAtom);
  const selectedAccounts = useAtomValue(accountCheckedListAtom);
  const resetCheckedList = useResetAtom(accountCheckedListAtom);

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  const handleClickDelete = () => {
    publish(ACCOUNT_EVENTS.sendDeleteAccount, Array.from(selectedAccounts));
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={SELECTOR.LIST_PAGINATION}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedAccounts.size === 0}
          isLoading={isLoading}
        />
      }
    />
  );
}
