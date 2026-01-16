"use client";

import { useAtom } from "jotai";

import { PRIVATE_REGISTRY_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry.constant";
import { privateRegistryPageAtom } from "@/domain/private-registry/state/private-registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface UserPrivateRegistryFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function UserPrivateRegistryFooter({
  totalSize,
  isLoading,
}: UserPrivateRegistryFooterProps) {
  const [page, setPage] = useAtom(privateRegistryPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={PRIVATE_REGISTRY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
