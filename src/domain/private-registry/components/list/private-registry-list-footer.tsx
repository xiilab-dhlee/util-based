"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetPrivateRegistries } from "@/domain/private-registry/hooks/use-get-private-registries";
import {
  privateRegistryPageAtom,
  privateRegistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

export function PrivateRegistryListFooter() {
  const [page, setPage] = useAtom(privateRegistryPageAtom);
  const searchText = useAtomValue(privateRegistrySearchTextAtom);

  const { data, isLoading } = useGetPrivateRegistries({
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
