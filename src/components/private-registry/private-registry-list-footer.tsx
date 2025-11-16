"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  privateRegistryPageAtom,
  privateRegistrySearchTextAtom,
} from "@/atoms/private-registry/private-registry.atom";
import privateRegistryListConstants from "@/constants/registry/private-registry-list.constant";
import { useGetPrivateRegistries } from "@/hooks/private-registry/use-get-private-registries";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

export function PrivateRegistryListFooter() {
  const [page, setPage] = useAtom(privateRegistryPageAtom);
  const searchText = useAtomValue(privateRegistrySearchTextAtom);

  const { data, isLoading } = useGetPrivateRegistries({
    page,
    size: privateRegistryListConstants.pageSize,
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
      total={data?.total || 0}
      page={page}
      pageSize={privateRegistryListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
