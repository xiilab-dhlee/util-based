"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import {
  userPendingPageAtom,
  userPendingSearchTextAtom,
} from "@/atoms/user/user-pending-list.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetPendingUsers } from "@/hooks/user/use-get-pending-users";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * 사용자 목록 페이지 상단 필터 컴포넌트
 *
 * 사용자 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 사용자 목록 페이지 상단 필터 컴포넌트
 */
export function UserPendingListFilter() {
  // 공통 검색 훅 사용
  const { onSubmit } = useSearch(userPendingSearchTextAtom);

  const page = useAtomValue(userPendingPageAtom);
  const searchText = useAtomValue(userPendingSearchTextAtom);

  const { data } = useGetPendingUsers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="가입 승인 목록" total={data?.totalSize}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        variant="gradient"
        icon="Close"
        iconPosition="left"
        width={70}
        height={30}
        onClick={() => {}}
      >
        반려
      </Button>
      <Button
        color="primary"
        variant="gradient"
        icon="Check"
        iconPosition="left"
        width={70}
        height={30}
        onClick={() => {}}
      >
        승인
      </Button>
    </MySearchFilter>
  );
}
