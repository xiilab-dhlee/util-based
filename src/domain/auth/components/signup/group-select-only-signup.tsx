"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { isString } from "es-toolkit/predicate";
import { Dropdown } from "xiilab-ui";

import { getGroups } from "@/api/generated/group-registration/group-registration";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

const QUERY_KEY = "group-select-signup";
const PAGE_SIZE = 30;

interface GroupSelectOnlySignupProps {
  value: string | null;
  setValue: (value: string | null) => void;
  disabled?: boolean;
}

/**
 * 그룹 목록을 무한 스크롤로 조회하는 커스텀 훅
 */
function useGroupOptions() {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getGroups(
        {
          pageNo: pageParam,
          pageSize: PAGE_SIZE,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 0,
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page?.content?.map((group) => ({
            label: group.groupName,
            value: group.groupId,
          })) ?? [],
      ),
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

/**
 * 회원가입 전용 그룹 선택 컴포넌트
 *
 * 회원가입 시 선택 가능한 그룹 목록을 무한 스크롤로 조회하여 드롭다운으로 표시합니다.
 */
export function GroupSelectOnlySignup({
  value,
  setValue,
  disabled = false,
}: GroupSelectOnlySignupProps) {
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGroupOptions();
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleChange = (v: string | number) => {
    if (isString(v)) {
      setValue(v);
    }
  };

  return (
    <Dropdown
      placeholder="그룹을 선택해 주세요."
      options={options}
      value={value}
      onChange={handleChange}
      width="100%"
      showSearch
      optionFilterProp="children"
      loading={isLoading || isFetchingNextPage}
      onPopupScroll={handlePopupScroll}
      disabled={disabled || options.length === 0}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
