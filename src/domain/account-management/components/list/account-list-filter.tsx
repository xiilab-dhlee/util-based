"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { useGetAccounts } from "@/domain/account-management/hooks/use-get-accounts";
import {
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 사용자 목록 페이지 상단 필터 컴포넌트
 *
 * 사용자 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 사용자 목록 페이지 상단 필터 컴포넌트
 */
export function AccountListFilter() {
  const setSearchText = useSetAtom(accountSearchTextAtom);
  const resetPage = useResetAtom(accountPageAtom);
  const page = useAtomValue(accountPageAtom);
  const searchText = useAtomValue(accountSearchTextAtom);

  const { data } = useGetAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="사용자 목록" total={data?.totalSize}>
      <SearchInput onSearch={handleSearch} />
    </MySearchFilter>
  );
}
