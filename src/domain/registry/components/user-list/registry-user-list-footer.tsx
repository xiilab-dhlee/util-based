"use client";

import { useAtom } from "jotai";

import { REGISTRY_USER_PAGE_SIZE } from "@/domain/registry/constants/registry-user-list.constant";
import { registryUserPageAtom } from "@/domain/registry/state/registry-user-list.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryUserListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function RegistryUserListFooter({
  totalSize,
  isLoading,
}: RegistryUserListFooterProps) {
  const [page, setPage] = useAtom(registryUserPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_USER_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={SELECTOR.LIST_PAGINATION}
    />
  );
}
