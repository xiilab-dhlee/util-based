"use client";

import { useSetAtom } from "jotai";
import { Input } from "xiilab-ui";

import { internalregistrySearchTextAtom } from "@/domain/internal-registry/state/internal-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function InternalRegistryListFilter() {
  const setSearchText = useSetAtom(internalregistrySearchTextAtom);

  const handleSearch = (value: string) => {
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="내부 레지스트리 목록" total={7777}>
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
