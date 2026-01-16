"use client";

import { useAtom } from "jotai";

import { privateRegistryVulnerabilityPageAtom } from "@/domain/private-registry/state/private-registry-vulnerability.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface PrivateRegistryTagFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function PrivateRegistryTagFooter({
  totalSize,
  isLoading,
}: PrivateRegistryTagFooterProps) {
  const [page, setPage] = useAtom(privateRegistryVulnerabilityPageAtom);

  // 페이지 변경 핸들러
  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
