"use client";

import { userPrivateRegistrySearchTextAtom } from "@/domain/registry/state/registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

export function UserPrivateRegistryListFilter() {
  const { onSubmit } = useSearch(userPrivateRegistrySearchTextAtom);

  return (
    <MySearchFilter title="사용자별 내부 레지스트리" total={7777}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
