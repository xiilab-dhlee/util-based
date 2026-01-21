"use client";

import { useAtom } from "jotai";

import { REGISTRY_JOB_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import { imageJobPageAtom } from "@/domain/registry/state/registry-list.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryJobListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function RegistryJobListFooter({
  totalSize,
  isLoading,
}: RegistryJobListFooterProps) {
  const [page, setPage] = useAtom(imageJobPageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_JOB_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={REGISTRY_SELECTOR.JOB_LIST_PAGINATION}
    />
  );
}
