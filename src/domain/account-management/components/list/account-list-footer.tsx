"use client";

import { useAtom } from "jotai";

import { accountPageAtom } from "@/domain/account-management/state/account.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface AccountListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function AccountListFooter({
  totalSize,
  isLoading,
}: AccountListFooterProps) {
  const [page, setPage] = useAtom(accountPageAtom);

  const handlePage = (page: number) => {
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
