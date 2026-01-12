"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
  privateregistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface PrivateRegistryListFilterProps {
  totalSize?: number;
}

export function PrivateRegistryListFilter({
  totalSize,
}: PrivateRegistryListFilterProps) {
  const setSearchText = useSetAtom(privateregistrySearchTextAtom);
  const resetPage = useResetAtom(privateregistryPageAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

  const handleSearch = (value: string) => {
    resetCheckedList();
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="프라이빗 레지스트리 목록" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
