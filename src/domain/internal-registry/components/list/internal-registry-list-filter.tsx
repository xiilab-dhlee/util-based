"use client";

import { internalregistrySearchTextAtom } from "@/domain/internal-registry/state/internal-registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

export function InternalRegistryListFilter() {
  const { onSubmit } = useSearch(internalregistrySearchTextAtom);

  return (
    <MySearchFilter title="내부 레지스트리 목록" total={7777}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
