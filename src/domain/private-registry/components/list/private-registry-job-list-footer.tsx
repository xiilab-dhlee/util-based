"use client";

import { useAtom } from "jotai";

import { PRIVATE_REGISTRY_JOB_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry.constant";
import { imageJobPageAtom } from "@/domain/private-registry/state/private-registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";

interface PrivateRegistryJobListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function PrivateRegistryJobListFooter({
  totalSize,
  isLoading,
}: PrivateRegistryJobListFooterProps) {
  const [page, setPage] = useAtom(imageJobPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={PRIVATE_REGISTRY_JOB_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_PAGINATION}
    />
  );
}
