"use client";

import { privateRegistrySearchTextAtom } from "@/domain/private-registry/state/private-registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

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
