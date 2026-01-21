"use client";

import { useAtom } from "jotai";

import { REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import { registryPageAtom } from "@/domain/registry/state/registry-list.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface UserPrivateRegistryFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function UserPrivateRegistryFooter({
  totalSize,
  isLoading,
}: UserPrivateRegistryFooterProps) {
  const [page, setPage] = useAtom(registryPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
