"use client";

import { useSetAtom } from "jotai";

import { userInternalRegistrySearchTextAtom } from "@/domain/registry/state/registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function UserInternalRegistryListFilter() {
  const setSearchText = useSetAtom(userInternalRegistrySearchTextAtom);

  return (
    <MySearchFilter title="사용자별 내부 레지스트리" total={7777}>
      <SearchInput onSearch={setSearchText} />
    </MySearchFilter>
  );
}
