"use client";

import { privateRegistrySearchTextAtom } from "@/atoms/private-registry/private-registry.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { useSearch } from "@/hooks/common/use-search";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function PrivateRegistryListFilter() {
  const { onSubmit } = useSearch(privateRegistrySearchTextAtom);

  return (
    <MySearchFilter title="내부 레지스트리 목록" total={7777}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
