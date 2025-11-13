"use client";

import { userPublicRegistrySearchTextAtom } from "@/atoms/registry/registry.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { useSearch } from "@/hooks/common/use-search";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function UserPublicRegistryListFilter() {
  const { onSubmit } = useSearch(userPublicRegistrySearchTextAtom);

  return (
    <MySearchFilter title="사용자별 외부 레지스트리" total={7777}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}

