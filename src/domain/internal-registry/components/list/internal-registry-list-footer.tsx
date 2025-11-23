"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetInternalRegistries } from "@/domain/internal-registry/hooks/use-get-internal-registries";
import {
  internalregistryPageAtom,
  internalregistrySearchTextAtom,
} from "@/domain/internal-registry/state/internal-registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

export function InternalRegistryListFooter() {
  const [page, setPage] = useAtom(internalregistryPageAtom);
  const searchText = useAtomValue(internalregistrySearchTextAtom);

  const { data, isLoading } = useGetInternalRegistries({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
