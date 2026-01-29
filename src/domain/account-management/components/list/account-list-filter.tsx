"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface AccountListFilterProps {
  totalSize?: number;
}

export function AccountListFilter({ totalSize }: AccountListFilterProps) {
  const setSearchText = useSetAtom(accountSearchTextAtom);
  const resetPage = useResetAtom(accountPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter
      title="사용자 목록"
      total={totalSize}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
