"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  userPrivateRegistryPageAtom,
  userPrivateRegistrySearchTextAtom,
} from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface UserPrivateRegistryFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function UserPrivateRegistryFilter({
  totalSize,
  loading,
}: UserPrivateRegistryFilterProps) {
  const setSearchText = useSetAtom(userPrivateRegistrySearchTextAtom);
  const resetPage = useResetAtom(userPrivateRegistryPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="사용자별 개인 레지스트리" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="사용자 이름을 검색해 주세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
      />
    </MySearchFilter>
  );
}
