"use client";

import { useAtom } from "jotai";

import { REGISTRY_TAG_VULNERABILITY_PAGE_SIZE } from "@/domain/registry/constants/registry-tag.constant";
import { registryTagVulnerabilityPageAtom } from "@/domain/registry/state/registry-tag.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface PrivateRegistryTagFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function RegistryTagFooter({
  totalSize,
  isLoading,
}: PrivateRegistryTagFooterProps) {
  const [page, setPage] = useAtom(registryTagVulnerabilityPageAtom);

  // 페이지 변경 핸들러
  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_TAG_VULNERABILITY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
