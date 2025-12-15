"use client";

import { useSetAtom } from "jotai";

import { internalregistrySearchTextAtom } from "@/domain/internal-registry/state/internal-registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function InternalRegistryListFilter() {
  const setSearchText = useSetAtom(internalregistrySearchTextAtom);

  return (
    <MySearchFilter title="내부 레지스트리 목록" total={7777}>
      <SearchInput onSearch={setSearchText} />
    </MySearchFilter>
  );
}
