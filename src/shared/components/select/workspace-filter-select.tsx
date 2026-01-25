"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { DropdownProps } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

import { getAllWorkspaces1 } from "@/api/generated/admin-workspace/admin-workspace";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

const QUERY_KEY = "workspace-filter-select";
const PAGE_SIZE = 30;

type WorkspaceFilterSelectProps = Omit<
  DropdownProps,
  | "options"
  | "loading"
  | "onPopupScroll"
  | "showSearch"
  | "filterOption"
  | "onSearch"
>;

/**
 * 관리자용 워크스페이스 목록을 무한 스크롤로 조회하는 커스텀 훅
 */
function useWorkspaceOptions(keyword: string) {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY, keyword, PAGE_SIZE],
    queryFn: ({ pageParam = 0, signal }) =>
      getAllWorkspaces1(
        {
          pageSearchRequest: {
            pageNo: pageParam,
            pageSize: PAGE_SIZE,
            keyword: keyword || undefined,
          },
          sortRequest: {
            sort: "WORKSPACE_NAME",
            order: "ASC",
          },
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
          page?.content?.map((workspace) => ({
            label: workspace.workspaceName,
            value: workspace.workspaceId,
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
 * 관리자용 워크스페이스 필터 선택 컴포넌트
 *
 * 무한 스크롤과 검색 기능을 통해 워크스페이스 목록을 페이지 단위로 조회하고
 * Dropdown 컴포넌트로 표시합니다.
 */
export function WorkspaceFilterSelect(props: WorkspaceFilterSelectProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWorkspaceOptions(keyword);
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleChange: DropdownProps["onChange"] = (value) => {
    props.onChange?.(value);
    resetKeyword();
  };

  return (
    <Dropdown
      {...props}
      options={options}
      loading={isLoading || isFetchingNextPage}
      onPopupScroll={handlePopupScroll}
      placeholder={props.placeholder ?? "워크스페이스 선택"}
      listHeight={DROPDOWN_LIST_HEIGHT}
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
    />
  );
}
