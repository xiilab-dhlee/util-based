"use client";

import { useSetAtom } from "jotai";
import { Input } from "xiilab-ui";

import { userInternalRegistrySearchTextAtom } from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function UserInternalRegistryListFilter() {
  const setSearchText = useSetAtom(userInternalRegistrySearchTextAtom);

  return (
    <MySearchFilter title="사용자별 내부 레지스트리" total={7777}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={(value) => setSearchText(value.trim())}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
