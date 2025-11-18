"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  privateRegistryPageAtom,
  privateRegistrySearchTextAtom,
} from "@/atoms/private-registry.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistries } from "@/hooks/private-registry/use-get-private-registries";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

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
