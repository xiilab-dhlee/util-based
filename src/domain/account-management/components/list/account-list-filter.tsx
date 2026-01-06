"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  accountCheckedListAtom,
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface AccountListFilterProps {
  totalSize?: number;
}

export function AccountListFilter({ totalSize }: AccountListFilterProps) {
  const setSearchText = useSetAtom(accountSearchTextAtom);
  const resetPage = useResetAtom(accountPageAtom);
  const resetCheckedList = useResetAtom(accountCheckedListAtom);

  const handleSearch = (value: string) => {
    resetCheckedList();
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="사용자 목록" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={(value) => handleSearch(value.trim())}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
