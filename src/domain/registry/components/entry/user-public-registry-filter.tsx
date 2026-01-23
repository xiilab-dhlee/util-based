"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  userPublicRegistryPageAtom,
  userPublicRegistrySearchTextAtom,
} from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface UserPublicRegistryFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function UserPublicRegistryFilter({
  totalSize,
  loading,
}: UserPublicRegistryFilterProps) {
  const setSearchText = useSetAtom(userPublicRegistrySearchTextAtom);
  const resetPage = useResetAtom(userPublicRegistryPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="사용자별 공유 레지스트리" total={totalSize}>
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
