"use client";

import { privateRegistrySearchTextAtom } from "@/domain/private-registry/state/private-registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

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
