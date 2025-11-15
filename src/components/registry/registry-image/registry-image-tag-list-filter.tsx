"use client";

import { privateRegistryImageTagSearchTextAtom } from "@/atoms/private-registry-image/admin-private-registry-image.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { useSearch } from "@/hooks/common/use-search";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function RegistryImageTagListFilter() {
  const { onSubmit } = useSearch(privateRegistryImageTagSearchTextAtom);

  return (
    <MySearchFilter title="태그 목록" total={7777}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
