"use client";

import { useAtomValue } from "jotai";

import { useGetUsers } from "@/domain/user/hooks/use-get-users";
import {
  userPageAtom,
  userSearchTextAtom,
} from "@/domain/user/state/user.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

/**
 * 사용자 목록 페이지 상단 필터 컴포넌트
 *
 * 사용자 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 사용자 목록 페이지 상단 필터 컴포넌트
 */
export function UserListFilter() {
  // 공통 검색 훅 사용
  const { onSubmit } = useSearch(userSearchTextAtom);

  const page = useAtomValue(userPageAtom);
  const searchText = useAtomValue(userSearchTextAtom);

  const { data } = useGetUsers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="사용자 목록" total={data?.totalSize}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
