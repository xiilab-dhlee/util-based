"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface AccountListFilterProps {
  totalSize?: number;
}

export function AccountListFilter({ totalSize }: AccountListFilterProps) {
  const setSearchText = useSetAtom(accountSearchTextAtom);
  const resetPage = useResetAtom(accountPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="사용자 목록" total={totalSize}>
      <SearchInput onSearch={handleSearch} />
    </MySearchFilter>
  );
}
