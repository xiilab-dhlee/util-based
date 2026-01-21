"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  userPrivateRegistryPageAtom,
  userPrivateRegistrySearchKeywordAtom,
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
  const [searchKeyword, setSearchKeyword] = useAtom(
    userPrivateRegistrySearchKeywordAtom,
  );
  const setSearchText = useSetAtom(userPrivateRegistrySearchTextAtom);
  const resetPage = useResetAtom(userPrivateRegistryPageAtom);

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="사용자별 개인 레지스트리" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        value={searchKeyword}
        onChange={handleSearchKeywordChange}
        disabled={loading}
      />
    </MySearchFilter>
  );
}
