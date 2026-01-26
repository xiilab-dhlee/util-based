"use client";

import { useAtom } from "jotai";

import { USER_REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry.constant";
import { userPrivateRegistryPageAtom } from "@/domain/registry/state/registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface UserPrivateRegistryFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function UserPrivateRegistryFooter({
  totalSize,
  isLoading,
}: UserPrivateRegistryFooterProps) {
  const [page, setPage] = useAtom(userPrivateRegistryPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={USER_REGISTRY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
